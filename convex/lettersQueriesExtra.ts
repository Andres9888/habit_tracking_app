/**
 * Letters Extra Queries
 * Additional query operations
 *
 * SEC-004: All queries require authentication and verify ownership
 */

import { v } from 'convex/values';
import { query } from './_generated/server';
import { letterObjectValidator } from './letters/index';

/**
 * Get the most recent unlocked letter for a habit (for Rescue Mode)
 * SEC-004: Requires authentication and habit ownership verification
 */
export const getMostRecentUnlocked = query({
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
    if (!habit || habit.userId !== identity.subject) {
      throw new Error('Not authorized to view letters for this habit');
    }

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
 * SEC-004: Requires authentication and ensures user can only access their own letters
 */
export const listByUser = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    // SEC-004: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to view letters');
    }

    // SEC-004: Only allow users to access their own letters
    const q = ctx.db
      .query('letters')
      .withIndex('by_user', (query) => query.eq('userId', identity.subject))
      .order('desc');
    return args.limit ? await q.take(args.limit) : await q.collect();
  },
  returns: v.array(letterObjectValidator),
});
