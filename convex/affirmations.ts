/**
 * Affirmations API
 *
 * Positive self-talk cards tied to specific habits.
 * Based on:
 * - Self-affirmation theory (Steele, 1988)
 * - Sports psychology self-talk research (Hatzigeorgiadis et al., 2011)
 *
 * Three types:
 * - identity: "I am someone who..." (most powerful)
 * - motivational: "I can do hard things"
 * - instructional: "Progress, not perfection"
 */

import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

const MAX_AFFIRMATIONS_PER_HABIT = 10;
const MAX_TEXT_LENGTH = 200;

/**
 * List all affirmations for a specific habit
 */
export const listByHabit = query({
  args: {
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    const affirmations = await ctx.db
      .query('affirmations')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .collect();

    // Sort by creation date (newest first)
    return affirmations.sort((a, b) => b.createdAt - a.createdAt);
  },
  returns: v.array(
    v.object({
      _creationTime: v.number(),
      _id: v.id('affirmations'),
      createdAt: v.number(),
      habitId: v.id('habits'),
      text: v.string(),
      type: v.optional(
        v.union(
          v.literal('identity'),
          v.literal('motivational'),
          v.literal('instructional')
        )
      ),
      updatedAt: v.number(),
      userId: v.optional(v.string()),
    })
  ),
});

/**
 * Create a new affirmation for a habit
 */
export const create = mutation({
  args: {
    habitId: v.id('habits'),
    text: v.string(),
    type: v.optional(
      v.union(
        v.literal('identity'),
        v.literal('motivational'),
        v.literal('instructional')
      )
    ),
  },
  handler: async (ctx, args) => {
    const text = args.text.trim();

    // Validation
    if (!text) {
      throw new Error('Affirmation text is required');
    }
    if (text.length > MAX_TEXT_LENGTH) {
      throw new Error(
        `Affirmation cannot exceed ${MAX_TEXT_LENGTH} characters`
      );
    }

    // Check habit exists
    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }

    // Check limit per habit
    const existing = await ctx.db
      .query('affirmations')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .collect();

    if (existing.length >= MAX_AFFIRMATIONS_PER_HABIT) {
      throw new Error(
        `Maximum ${MAX_AFFIRMATIONS_PER_HABIT} affirmations per habit. Remove one to add another.`
      );
    }

    const now = Date.now();
    return await ctx.db.insert('affirmations', {
      createdAt: now,
      habitId: args.habitId,
      text,
      type: args.type,
      updatedAt: now,
    });
  },
  returns: v.id('affirmations'),
});

/**
 * Update an existing affirmation
 */
export const update = mutation({
  args: {
    id: v.id('affirmations'),
    text: v.optional(v.string()),
    type: v.optional(
      v.union(
        v.literal('identity'),
        v.literal('motivational'),
        v.literal('instructional')
      )
    ),
  },
  handler: async (ctx, args) => {
    const affirmation = await ctx.db.get(args.id);
    if (!affirmation) {
      throw new Error('Affirmation not found');
    }

    const updates: {
      text?: string;
      type?: 'identity' | 'motivational' | 'instructional';
      updatedAt: number;
    } = {
      updatedAt: Date.now(),
    };

    if (args.text !== undefined) {
      const text = args.text.trim();
      if (!text) {
        throw new Error('Affirmation text is required');
      }
      if (text.length > MAX_TEXT_LENGTH) {
        throw new Error(
          `Affirmation cannot exceed ${MAX_TEXT_LENGTH} characters`
        );
      }
      updates.text = text;
    }

    if (args.type !== undefined) {
      updates.type = args.type;
    }

    await ctx.db.patch(args.id, updates);
    return null;
  },
  returns: v.null(),
});

/**
 * Delete an affirmation
 */
export const remove = mutation({
  args: {
    id: v.id('affirmations'),
  },
  handler: async (ctx, args) => {
    const affirmation = await ctx.db.get(args.id);
    if (!affirmation) {
      throw new Error('Affirmation not found');
    }

    await ctx.db.delete(args.id);
    return null;
  },
  returns: v.null(),
});

// ============================================================================
// SCHEDULED DELIVERY (Premium Feature)
// ============================================================================

/**
 * Validate time string format (HH:MM 24-hour)
 */
function isValidTimeFormat(time: string): boolean {
  const match = time.match(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/);
  return match !== null;
}

/**
 * Validate days of week array
 */
function isValidDaysOfWeek(days: number[]): boolean {
  if (days.length === 0 || days.length > 7) return false;
  return days.every((day) => day >= 0 && day <= 6 && Number.isInteger(day));
}

/**
 * Schedule delivery for an affirmation (Premium feature)
 *
 * Sets up recurring push notifications at specified times.
 * Supports daily (every day) or weekly (specific days) frequency.
 */
export const scheduleDelivery = mutation({
  args: {
    daysOfWeek: v.optional(v.array(v.number())),

    // "HH:MM" format
    frequency: v.union(v.literal('daily'), v.literal('weekly')),
    id: v.id('affirmations'),
    scheduledTime: v.string(), // Required for weekly
  },
  handler: async (ctx, args) => {
    const affirmation = await ctx.db.get(args.id);
    if (!affirmation) {
      throw new Error('Affirmation not found');
    }

    // Validate time format
    if (!isValidTimeFormat(args.scheduledTime)) {
      throw new Error(
        'Invalid time format. Use HH:MM 24-hour format (e.g., "08:30")'
      );
    }

    // Validate weekly frequency requires daysOfWeek
    if (args.frequency === 'weekly') {
      if (!args.daysOfWeek || args.daysOfWeek.length === 0) {
        throw new Error(
          'Weekly frequency requires at least one day of the week'
        );
      }
      if (!isValidDaysOfWeek(args.daysOfWeek)) {
        throw new Error(
          'Invalid days of week. Use numbers 0-6 (Sunday-Saturday)'
        );
      }
    }

    // Update affirmation with schedule settings
    await ctx.db.patch(args.id, {
      daysOfWeek: args.frequency === 'weekly' ? args.daysOfWeek : undefined,
      frequency: args.frequency,
      isScheduleEnabled: true,
      scheduledTime: args.scheduledTime,
      updatedAt: Date.now(),
    });

    return null;
  },
  returns: v.null(),
});

/**
 * Update the notification ID for an affirmation
 *
 * Called from the client after scheduling the local notification.
 * Stores the notification identifier for future cancellation.
 */
export const updateNotificationId = mutation({
  args: {
    id: v.id('affirmations'),
    notificationId: v.string(),
  },
  handler: async (ctx, args) => {
    const affirmation = await ctx.db.get(args.id);
    if (!affirmation) {
      throw new Error('Affirmation not found');
    }

    await ctx.db.patch(args.id, {
      notificationId: args.notificationId,
      updatedAt: Date.now(),
    });

    return null;
  },
  returns: v.null(),
});

/**
 * Toggle scheduled delivery on/off
 *
 * Preserves schedule settings when disabled so they can be re-enabled easily.
 */
export const toggleSchedule = mutation({
  args: {
    enabled: v.boolean(),
    id: v.id('affirmations'),
  },
  handler: async (ctx, args) => {
    const affirmation = await ctx.db.get(args.id);
    if (!affirmation) {
      throw new Error('Affirmation not found');
    }

    // Can only enable if schedule is configured
    if (args.enabled && !affirmation.scheduledTime) {
      throw new Error(
        'Cannot enable schedule: no scheduled time configured. Use scheduleDelivery first.'
      );
    }

    await ctx.db.patch(args.id, {
      isScheduleEnabled: args.enabled,
      // Clear notification ID when disabling (client will cancel notification)
      notificationId: args.enabled ? affirmation.notificationId : undefined,
      updatedAt: Date.now(),
    });

    return null;
  },
  returns: v.null(),
});

/**
 * Cancel scheduled delivery for an affirmation
 *
 * Removes all schedule settings from the affirmation.
 */
export const cancelSchedule = mutation({
  args: {
    id: v.id('affirmations'),
  },
  handler: async (ctx, args) => {
    const affirmation = await ctx.db.get(args.id);
    if (!affirmation) {
      throw new Error('Affirmation not found');
    }

    await ctx.db.patch(args.id, {
      daysOfWeek: undefined,
      frequency: undefined,
      isScheduleEnabled: undefined,
      lastDeliveredAt: undefined,
      notificationId: undefined,
      scheduledTime: undefined,
      updatedAt: Date.now(),
    });

    return null;
  },
  returns: v.null(),
});

/**
 * Record a successful delivery
 *
 * Called when a notification is delivered and opened.
 * Used for analytics and tracking delivery patterns.
 */
export const recordDelivery = mutation({
  args: {
    id: v.id('affirmations'),
  },
  handler: async (ctx, args) => {
    const affirmation = await ctx.db.get(args.id);
    if (!affirmation) {
      throw new Error('Affirmation not found');
    }

    await ctx.db.patch(args.id, {
      lastDeliveredAt: Date.now(),
      updatedAt: Date.now(),
    });

    return null;
  },
  returns: v.null(),
});

/**
 * Get all scheduled affirmations for a user
 *
 * Returns affirmations with active schedules, useful for
 * re-scheduling notifications after app restart.
 */
export const listScheduled = query({
  args: {
    habitId: v.optional(v.id('habits')),
  },
  handler: async (ctx, args) => {
    // Get scheduled affirmations for specific habit or all scheduled
    const affirmations = args.habitId
      ? await ctx.db
          .query('affirmations')
          .withIndex('by_habit', (q) => q.eq('habitId', args.habitId!))
          .filter((q) => q.eq(q.field('isScheduleEnabled'), true))
          .collect()
      : await ctx.db
          .query('affirmations')
          .withIndex('by_schedule', (q) => q.eq('isScheduleEnabled', true))
          .collect();

    return affirmations;
  },
  returns: v.array(
    v.object({
      _creationTime: v.number(),
      _id: v.id('affirmations'),
      createdAt: v.number(),
      daysOfWeek: v.optional(v.array(v.number())),
      frequency: v.optional(v.union(v.literal('daily'), v.literal('weekly'))),
      habitId: v.id('habits'),
      isScheduleEnabled: v.optional(v.boolean()),
      lastDeliveredAt: v.optional(v.number()),
      notificationId: v.optional(v.string()),
      scheduledTime: v.optional(v.string()),
      text: v.string(),
      type: v.optional(
        v.union(
          v.literal('identity'),
          v.literal('motivational'),
          v.literal('instructional')
        )
      ),
      updatedAt: v.number(),
      userId: v.optional(v.string()),
    })
  ),
});

/**
 * Get a single affirmation with full schedule details
 */
export const get = query({
  args: {
    id: v.id('affirmations'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
  returns: v.union(
    v.null(),
    v.object({
      _creationTime: v.number(),
      _id: v.id('affirmations'),
      createdAt: v.number(),
      daysOfWeek: v.optional(v.array(v.number())),
      frequency: v.optional(v.union(v.literal('daily'), v.literal('weekly'))),
      habitId: v.id('habits'),
      isScheduleEnabled: v.optional(v.boolean()),
      lastDeliveredAt: v.optional(v.number()),
      notificationId: v.optional(v.string()),
      scheduledTime: v.optional(v.string()),
      text: v.string(),
      type: v.optional(
        v.union(
          v.literal('identity'),
          v.literal('motivational'),
          v.literal('instructional')
        )
      ),
      updatedAt: v.number(),
      userId: v.optional(v.string()),
    })
  ),
});
