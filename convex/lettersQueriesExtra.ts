/**
 * Letters Extra Queries
 * Additional query operations
 */

import { v } from 'convex/values';
import { query } from './_generated/server';
import { letterObjectValidator } from './letters/index';

/**
 * Get the most recent unlocked letter for a habit (for Rescue Mode)
 */
export const getMostRecentUnlocked = query({
  args: { habitId: v.id('habits') },
  handler: async (ctx, args) => {
    const now = Date.now();
    const letters = await ctx.db
      .query('letters')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .order('desc')
      .collect();

    const unlocked = letters.filter((letter) => letter.unlockAt <= now);
    if (unlocked.length === 0) return null;

    unlocked.sort((a, b) => b.unlockAt - a.unlockAt);
    return unlocked[0];
  },
  returns: v.union(v.null(), letterObjectValidator),
});

/**
 * Get letters by user (for user dashboard/profile)
 */
export const listByUser = query({
  args: { limit: v.optional(v.number()), userId: v.string() },
  handler: async (ctx, args) => {
    const q = ctx.db
      .query('letters')
      .withIndex('by_user', (query) => query.eq('userId', args.userId))
      .order('desc');
    return args.limit ? await q.take(args.limit) : await q.collect();
  },
  returns: v.array(letterObjectValidator),
});
