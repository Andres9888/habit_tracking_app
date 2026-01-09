/**
 * Letters Query API
 */

import { v } from 'convex/values';
import { query } from './_generated/server';
import { letterObjectValidator, letterStatsValidator } from './letters/index';

/**
 * Get all letters for a specific habit
 */
export const listByHabit = query({
  args: { habitId: v.id('habits'), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
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
 */
export const getUnreadUnlocked = query({
  args: { habitId: v.id('habits') },
  handler: async (ctx, args) => {
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
 */
export const getUpcomingUnlocks = query({
  args: { habitId: v.optional(v.id('habits')), userId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const now = Date.now();
    const in24Hours = now + 24 * 60 * 60 * 1000;
    let letters;

    if (args.habitId) {
      letters = await ctx.db
        .query('letters')
        .withIndex('by_habit', (q) => q.eq('habitId', args.habitId!))
        .collect();
    } else if (args.userId) {
      letters = await ctx.db
        .query('letters')
        .withIndex('by_user', (q) => q.eq('userId', args.userId))
        .collect();
    } else {
      letters = await ctx.db.query('letters').collect();
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
 */
export const get = query({
  args: { letterId: v.id('letters') },
  handler: async (ctx, args) => await ctx.db.get(args.letterId),
  returns: v.union(v.null(), letterObjectValidator),
});

/**
 * Count letters for a habit
 */
export const countByHabit = query({
  args: { habitId: v.id('habits') },
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
  args: { habitId: v.id('habits') },
  handler: async (ctx, args) => {
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
