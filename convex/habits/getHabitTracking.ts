/**
 * Get Tracking Data For One Habit
 *
 * The detail screen needs a long, habit-scoped history (year-to-date) to build
 * its insight cards. `getTracking` is user-scoped and would pull every habit's
 * rows across the same range, so this query narrows to a single habit using the
 * `by_habit_and_date` index.
 *
 * Rows carry `_creationTime`, which the insight layer uses as a proxy for
 * "when did you actually tick this off" — see `insights/dayparts.ts`.
 */
import { v } from 'convex/values';
import { query } from '../_generated/server';
import {
  insightTrackingValidator,
  projectInsightTracking,
} from './insightTracking';

export const getHabitTracking = query({
  args: {
    endDate: v.string(),
    habitId: v.id('habits'),
    startDate: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const habit = await ctx.db.get(args.habitId);
    if (!habit || habit.userId !== identity.subject) return [];

    const ascending = args.startDate <= args.endDate;
    const startDate = ascending ? args.startDate : args.endDate;
    const endDate = ascending ? args.endDate : args.startDate;

    const rows = await ctx.db
      .query('tracking')
      .withIndex('by_habit_and_date', (q) =>
        q.eq('habitId', args.habitId).gte('date', startDate).lte('date', endDate)
      )
      .collect();

    return rows.map((row) => projectInsightTracking(row));
  },
  returns: v.array(insightTrackingValidator),
});
