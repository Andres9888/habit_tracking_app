/**
 * Affirmations Schedule Mutations
 *
 * Premium feature mutations for scheduled delivery management.
 */

import { v } from 'convex/values';
import { mutation } from './_generated/server';
import { isValidTimeFormat, isValidDaysOfWeek } from './affirmations/index';
import { requirePremium } from './subscriptions/premiumCheck';

/**
 * Schedule delivery for an affirmation (Premium feature)
 */
export const scheduleDelivery = mutation({
  args: {
    daysOfWeek: v.optional(v.array(v.number())),
    frequency: v.union(v.literal('daily'), v.literal('weekly')),
    id: v.id('affirmations'),
    scheduledTime: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to schedule affirmations');
    }

    // SEC-005: Premium feature — Scheduled affirmation delivery requires premium
    await requirePremium(ctx, identity.subject, 'Scheduled Affirmation Delivery');

    const affirmation = await ctx.db.get(args.id);
    if (!affirmation) throw new Error('Affirmation not found');

    // SEC-008: Ownership verification via record userId and parent habit
    if (affirmation.userId && affirmation.userId !== identity.subject) {
      throw new Error('Not authorized to schedule this affirmation');
    }
    const habit = await ctx.db.get(affirmation.habitId);
    if (!habit || habit.userId !== identity.subject) {
      throw new Error('Not authorized to schedule this affirmation');
    }

    if (!isValidTimeFormat(args.scheduledTime)) {
      throw new Error('Invalid time format. Use HH:MM 24-hour format');
    }

    if (args.frequency === 'weekly') {
      if (!args.daysOfWeek || args.daysOfWeek.length === 0) {
        throw new Error('Weekly frequency requires at least one day');
      }
      if (!isValidDaysOfWeek(args.daysOfWeek)) {
        throw new Error('Invalid days of week. Use numbers 0-6');
      }
    }

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
 */
export const updateNotificationId = mutation({
  args: { id: v.id('affirmations'), notificationId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to update notification ID');
    }

    const affirmation = await ctx.db.get(args.id);
    if (!affirmation) throw new Error('Affirmation not found');

    // SEC-008: Ownership verification via record userId and parent habit
    if (affirmation.userId && affirmation.userId !== identity.subject) {
      throw new Error('Not authorized to update this affirmation');
    }
    const habit = await ctx.db.get(affirmation.habitId);
    if (!habit || habit.userId !== identity.subject) {
      throw new Error('Not authorized to update this affirmation');
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
 */
export const toggleSchedule = mutation({
  args: { enabled: v.boolean(), id: v.id('affirmations') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to toggle schedule');
    }

    const affirmation = await ctx.db.get(args.id);
    if (!affirmation) throw new Error('Affirmation not found');

    // SEC-008: Ownership verification via record userId and parent habit
    if (affirmation.userId && affirmation.userId !== identity.subject) {
      throw new Error('Not authorized to toggle this affirmation schedule');
    }
    const habit = await ctx.db.get(affirmation.habitId);
    if (!habit || habit.userId !== identity.subject) {
      throw new Error('Not authorized to toggle this affirmation schedule');
    }

    if (args.enabled && !affirmation.scheduledTime) {
      throw new Error(
        'Cannot enable: no scheduled time. Use scheduleDelivery first.'
      );
    }

    await ctx.db.patch(args.id, {
      isScheduleEnabled: args.enabled,
      notificationId: args.enabled ? affirmation.notificationId : undefined,
      updatedAt: Date.now(),
    });
    return null;
  },
  returns: v.null(),
});

/**
 * Cancel scheduled delivery for an affirmation
 */
export const cancelSchedule = mutation({
  args: { id: v.id('affirmations') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to cancel schedule');
    }

    const affirmation = await ctx.db.get(args.id);
    if (!affirmation) throw new Error('Affirmation not found');

    // SEC-008: Ownership verification via record userId and parent habit
    if (affirmation.userId && affirmation.userId !== identity.subject) {
      throw new Error('Not authorized to cancel this affirmation schedule');
    }
    const habit = await ctx.db.get(affirmation.habitId);
    if (!habit || habit.userId !== identity.subject) {
      throw new Error('Not authorized to cancel this affirmation schedule');
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
 */
export const recordDelivery = mutation({
  args: { id: v.id('affirmations') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to record delivery');
    }

    const affirmation = await ctx.db.get(args.id);
    if (!affirmation) throw new Error('Affirmation not found');

    // SEC-008: Ownership verification via record userId and parent habit
    if (affirmation.userId && affirmation.userId !== identity.subject) {
      throw new Error('Not authorized to record delivery for this affirmation');
    }
    const habit = await ctx.db.get(affirmation.habitId);
    if (!habit || habit.userId !== identity.subject) {
      throw new Error('Not authorized to record delivery for this affirmation');
    }
    await ctx.db.patch(args.id, {
      lastDeliveredAt: Date.now(),
      updatedAt: Date.now(),
    });
    return null;
  },
  returns: v.null(),
});
