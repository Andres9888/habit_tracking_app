/**
 * Letters to Self API
 * Time-locked messages from past self to future self
 *
 * Scientific Basis:
 * - Temporal self-continuity: Connecting with future self increases self-control
 * - Delayed gratification psychology (Mischel's marshmallow studies)
 *
 * Business Model:
 * - Premium feature: creates anticipation, unique feature, emotional depth
 * - Users pay for emotional experiences (Calm model)
 *
 * Story T11: Letters to Self
 */

import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// Letter object validator for return types
const letterObjectValidator = v.object({
  _creationTime: v.number(),
  _id: v.id('letters'),
  content: v.string(),
  createdAt: v.number(),
  habitId: v.id('habits'),
  isRead: v.boolean(),
  title: v.optional(v.string()),
  unlockAt: v.number(),
  updatedAt: v.optional(v.number()),
  userId: v.optional(v.string()),
});

// Constants for unlock duration options (in days)
export const UNLOCK_DURATION_OPTIONS = {
  MONTH: 30,
  QUARTER: 90,
  TWO_WEEKS: 14,
  WEEK: 7,
} as const;

// Maximum content length (5000 characters)
const MAX_CONTENT_LENGTH = 5000;

// Maximum title length (100 characters)
const MAX_TITLE_LENGTH = 100;

/**
 * Get all letters for a specific habit
 */
export const listByHabit = query({
  args: {
    habitId: v.id('habits'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const query = ctx.db
      .query('letters')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .order('desc');

    if (args.limit) {
      return await query.take(args.limit);
    }

    return await query.collect();
  },
  returns: v.array(letterObjectValidator),
});

/**
 * Get all unlocked letters for a habit that haven't been read yet
 * Used for notifications and surfacing in Rescue Mode
 */
export const getUnreadUnlocked = query({
  args: {
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const letters = await ctx.db
      .query('letters')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .collect();

    // Filter for unlocked and unread letters
    return letters.filter((letter) => letter.unlockAt <= now && !letter.isRead);
  },
  returns: v.array(letterObjectValidator),
});

/**
 * Get all letters that are about to unlock (within next 24 hours)
 * Used for scheduling unlock notifications
 */
export const getUpcomingUnlocks = query({
  args: {
    habitId: v.optional(v.id('habits')),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const in24Hours = now + 24 * 60 * 60 * 1000;

    let letters;

    if (args.habitId) {
      const habitId = args.habitId;
      letters = await ctx.db
        .query('letters')
        .withIndex('by_habit', (q) => q.eq('habitId', habitId))
        .collect();
    } else if (args.userId) {
      letters = await ctx.db
        .query('letters')
        .withIndex('by_user', (q) => q.eq('userId', args.userId))
        .collect();
    } else {
      letters = await ctx.db.query('letters').collect();
    }

    // Filter for letters that unlock within the next 24 hours
    return letters.filter(
      (letter) =>
        letter.unlockAt > now && letter.unlockAt <= in24Hours && !letter.isRead
    );
  },
  returns: v.array(letterObjectValidator),
});

/**
 * Get a single letter by ID
 */
export const get = query({
  args: {
    letterId: v.id('letters'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.letterId);
  },
  returns: v.union(v.null(), letterObjectValidator),
});

/**
 * Count letters for a habit (for premium gating or analytics)
 */
export const countByHabit = query({
  args: {
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    const letters = await ctx.db
      .query('letters')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .collect();

    return letters.length;
  },
  returns: v.number(),
});

/**
 * Get letter statistics for a habit
 */
export const getStats = query({
  args: {
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const letters = await ctx.db
      .query('letters')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .collect();

    const total = letters.length;
    const locked = letters.filter((l) => l.unlockAt > now).length;
    const unlocked = letters.filter((l) => l.unlockAt <= now).length;
    const unread = letters.filter((l) => l.unlockAt <= now && !l.isRead).length;
    const read = letters.filter((l) => l.isRead).length;

    return {
      locked,
      read,
      total,
      unlocked,
      unread,
    };
  },
  returns: v.object({
    locked: v.number(),
    read: v.number(),
    total: v.number(),
    unlocked: v.number(),
    unread: v.number(),
  }),
});

/**
 * Create a new letter to self
 */
export const create = mutation({
  args: {
    content: v.string(),
    habitId: v.id('habits'),
    title: v.optional(v.string()),
    unlockDays: v.number(), // Number of days until unlock
  },
  handler: async (ctx, args) => {
    // Validate that habit exists
    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }

    // Validate content
    if (!args.content || args.content.trim() === '') {
      throw new Error('Letter content is required');
    }
    if (args.content.length > MAX_CONTENT_LENGTH) {
      throw new Error(
        `Letter content cannot exceed ${MAX_CONTENT_LENGTH} characters`
      );
    }

    // Validate title length
    if (args.title && args.title.length > MAX_TITLE_LENGTH) {
      throw new Error(`Title cannot exceed ${MAX_TITLE_LENGTH} characters`);
    }

    // Validate unlock duration
    if (args.unlockDays <= 0) {
      throw new Error('Unlock days must be positive');
    }
    if (args.unlockDays > 365) {
      throw new Error('Unlock duration cannot exceed 1 year');
    }

    const now = Date.now();
    const unlockAt = now + args.unlockDays * 24 * 60 * 60 * 1000;

    return await ctx.db.insert('letters', {
      content: args.content.trim(),
      createdAt: now,
      habitId: args.habitId,
      isRead: false,
      title: args.title?.trim(),
      unlockAt,
    });
  },
  returns: v.id('letters'),
});

/**
 * Mark a letter as read
 * Can only be done after the letter has unlocked
 */
export const markAsRead = mutation({
  args: {
    letterId: v.id('letters'),
  },
  handler: async (ctx, args) => {
    const letter = await ctx.db.get(args.letterId);
    if (!letter) {
      throw new Error('Letter not found');
    }

    const now = Date.now();

    // Check if letter is unlocked
    if (letter.unlockAt > now) {
      throw new Error('Letter is still locked');
    }

    // Already read - idempotent operation
    if (letter.isRead) {
      return args.letterId;
    }

    await ctx.db.patch(args.letterId, {
      isRead: true,
      updatedAt: now,
    });

    return args.letterId;
  },
  returns: v.id('letters'),
});

/**
 * Update a letter's content or title
 * Can only be done while the letter is still locked
 */
export const update = mutation({
  args: {
    content: v.optional(v.string()),
    letterId: v.id('letters'),
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const letter = await ctx.db.get(args.letterId);
    if (!letter) {
      throw new Error('Letter not found');
    }

    const now = Date.now();

    // Check if letter is still locked (can only edit while locked)
    if (letter.unlockAt <= now) {
      throw new Error('Cannot edit an unlocked letter');
    }

    // Validate content if provided
    if (args.content !== undefined) {
      if (!args.content || args.content.trim() === '') {
        throw new Error('Letter content is required');
      }
      if (args.content.length > MAX_CONTENT_LENGTH) {
        throw new Error(
          `Letter content cannot exceed ${MAX_CONTENT_LENGTH} characters`
        );
      }
    }

    // Validate title length if provided
    if (
      args.title !== undefined &&
      args.title &&
      args.title.length > MAX_TITLE_LENGTH
    ) {
      throw new Error(`Title cannot exceed ${MAX_TITLE_LENGTH} characters`);
    }

    const updates: Record<string, unknown> = { updatedAt: now };

    if (args.content !== undefined) {
      updates.content = args.content.trim();
    }
    if (args.title !== undefined) {
      updates.title = args.title?.trim();
    }

    await ctx.db.patch(args.letterId, updates);

    return args.letterId;
  },
  returns: v.id('letters'),
});

/**
 * Delete a letter
 * Can only be done while the letter is still locked
 */
export const remove = mutation({
  args: {
    letterId: v.id('letters'),
  },
  handler: async (ctx, args) => {
    const letter = await ctx.db.get(args.letterId);
    if (!letter) {
      throw new Error('Letter not found');
    }

    const now = Date.now();

    // Check if letter is still locked (can only delete while locked)
    if (letter.unlockAt <= now) {
      throw new Error('Cannot delete an unlocked letter');
    }

    await ctx.db.delete(args.letterId);
    return null;
  },
  returns: v.null(),
});

/**
 * Get the most recent unlocked letter for a habit
 * Used for surfacing in Rescue Mode
 */
export const getMostRecentUnlocked = query({
  args: {
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const letters = await ctx.db
      .query('letters')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .order('desc')
      .collect();

    // Find the most recently unlocked letter
    const unlocked = letters.filter((letter) => letter.unlockAt <= now);

    if (unlocked.length === 0) {
      return null;
    }

    // Sort by unlock date descending to get most recent
    unlocked.sort((a, b) => b.unlockAt - a.unlockAt);

    return unlocked[0];
  },
  returns: v.union(v.null(), letterObjectValidator),
});

/**
 * Get letters by user (for user dashboard/profile)
 */
export const listByUser = query({
  args: {
    limit: v.optional(v.number()),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const query = ctx.db
      .query('letters')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .order('desc');

    if (args.limit) {
      return await query.take(args.limit);
    }

    return await query.collect();
  },
  returns: v.array(letterObjectValidator),
});
