/**
 * Get Single Habit Query
 * Fetch a habit by ID with stored strength values
 *
 * PERF: Uses stored strength/strengthLevel from the habit document
 * (kept up-to-date by recalculateStreakAndStrength on toggle)
 * instead of loading the full tracking history to recompute.
 */
import { v } from 'convex/values';
import { query } from '../_generated/server';
import { fullHabitValidator } from './types';

export const get = query({
  args: { habitId: v.id('habits'), timezone: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const habit = await ctx.db.get(args.habitId);
    if (!habit) return null;
    if (habit.userId !== identity.subject) return null;

    return habit;
  },
  returns: v.union(v.null(), fullHabitValidator),
});
