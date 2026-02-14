/**
 * Letters Query API
 * SEC-004: All queries require authentication and verify ownership
 * to prevent unauthorized access to letter data
 */

import { v } from 'convex/values';
import { query } from './_generated/server';
import { letterObjectValidator, letterStatsValidator } from './letters/index';

/**
 * Get all letters for a specific habit
 * SEC-004: Requires authentication and habit ownership verification
 */
export const listByHabit = query({
  args: { habitId: v.id('habits'), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    // SEC-004: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to view letters');
    }

    // SEC-004: Ownership verification via habit
    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }
    if (habit.userId !== identity.subject) {
      throw new Error('Not authorized to view letters for this habit');
    }

    const q = ctx.db
      .query('letters')
      .withIndex('by_habit', (query) => query.eq('habitId', args.habitId))
      .order('desc');
    return args.limit ? await q.take(args.limit) : await q.collect();
  },
  returns: v.array(letterObjectValidator),
});

/**
 * Get all unlocked letters for a habit that haven't been read yet
 * SEC-004: Requires authentication and habit ownership verification
 */
export const getUnreadUnlocked = query({
  args: { habitId: v.id('habits') },
  handler: async (ctx, args) => {
    // SEC-004: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to view letters');
    }

    // SEC-004: Ownership verification via habit
    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }
    if (habit.userId !== identity.subject) {
      throw new Error('Not authorized to view letters for this habit');
    }

    const now = Date.now();
    const letters = await ctx.db
      .query('letters')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .collect();
    return letters.filter((letter) => letter.unlockAt <= now && !letter.isRead);
  },
  returns: v.array(letterObjectValidator),
});

/**
 * Get all letters that are about to unlock (within next 24 hours)
 * SEC-004: Requires authentication and ownership verification
 */
export const getUpcomingUnlocks = query({
  args: { habitId: v.optional(v.id('habits')), userId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    // SEC-004: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to view letters');
    }

    const now = Date.now();
    const in24Hours = now + 24 * 60 * 60 * 1000;
    let letters;

    if (args.habitId) {
      // SEC-004: Ownership verification via habit
      const habit = await ctx.db.get(args.habitId);
      if (!habit) {
        throw new Error('Habit not found');
      }
      if (habit.userId !== identity.subject) {
        throw new Error('Not authorized to view letters for this habit');
      }

      letters = await ctx.db
        .query('letters')
        .withIndex('by_habit', (q) => q.eq('habitId', args.habitId!))
        .collect();
    } else if (args.userId) {
      // SEC-004: Only allow users to access their own upcoming unlocks
      if (args.userId !== identity.subject) {
        throw new Error(
          'Not authorized to view upcoming unlocks for this user'
        );
      }

      letters = await ctx.db
        .query('letters')
        .withIndex('by_user', (q) => q.eq('userId', args.userId))
        .collect();
    } else {
      // SEC-004: Default to current user's letters
      letters = await ctx.db
        .query('letters')
        .withIndex('by_user', (q) => q.eq('userId', identity.subject))
        .collect();
    }

    return letters.filter(
      (letter) =>
        letter.unlockAt > now && letter.unlockAt <= in24Hours && !letter.isRead
    );
  },
  returns: v.array(letterObjectValidator),
});

/**
 * Get a single letter by ID
 * SEC-004: Requires authentication and ownership verification
 */
export const get = query({
  args: { letterId: v.id('letters') },
  handler: async (ctx, args) => {
    // SEC-004: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to view letters');
    }

    const letter = await ctx.db.get(args.letterId);
    if (!letter) {
      return null;
    }

    // SEC-004: Ownership verification
    if (letter.userId !== identity.subject) {
      throw new Error('Not authorized to view this letter');
    }

    return letter;
  },
  returns: v.union(v.null(), letterObjectValidator),
});

/**
 * Count letters for a habit
 * SEC-004: Requires authentication and habit ownership verification
 */
export const countByHabit = query({
  args: { habitId: v.id('habits') },
  handler: async (ctx, args) => {
    // SEC-004: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to view letters');
    }

    // SEC-004: Ownership verification via habit
    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }
    if (habit.userId !== identity.subject) {
      throw new Error('Not authorized to view letters for this habit');
    }

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
 * SEC-004: Requires authentication and habit ownership verification
 */
export const getStats = query({
  args: { habitId: v.id('habits') },
  handler: async (ctx, args) => {
    // SEC-004: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to view letters');
    }

    // SEC-004: Ownership verification via habit
    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }
    if (habit.userId !== identity.subject) {
      throw new Error('Not authorized to view letters for this habit');
    }

    const now = Date.now();
    const letters = await ctx.db
      .query('letters')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .collect();

    return {
      locked: letters.filter((l) => l.unlockAt > now).length,
      read: letters.filter((l) => l.isRead).length,
      total: letters.length,
      unlocked: letters.filter((l) => l.unlockAt <= now).length,
      unread: letters.filter((l) => l.unlockAt <= now && !l.isRead).length,
    };
  },
  returns: letterStatsValidator,
});

// Additional queries in ./lettersQueriesExtra.ts
export { getMostRecentUnlocked, listByUser } from './lettersQueriesExtra';
