/**
 * Get Single Habit Query
 * Fetch a habit by ID with stored strength values
 *
 * PERF: Uses stored strength/strengthLevel from the habit document
 * (kept up-to-date by recalculateStreakAndStrength on toggle)
 * instead of loading the full tracking history to recompute.
 *
 * `startSmallVersion` is joined from the template the habit was imported from
 * (via `templateUsage`). It is authored copy for the smallest version of the
 * habit and is read by the Detail recovery hint; it is never stored on the
 * habit document.
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

    const usage = await ctx.db
      .query('templateUsage')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .first();
    const template = usage ? await ctx.db.get(usage.templateId) : null;
    const startSmallVersion = template?.startSmallVersion?.trim();

    return startSmallVersion ? { ...habit, startSmallVersion } : habit;
  },
  returns: v.union(
    v.null(),
    v.object({
      ...fullHabitValidator.fields,
      startSmallVersion: v.optional(v.string()),
    })
  ),
});
