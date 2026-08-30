/**
 * Get Tracking Data For One Habit
 *
 * Detail requests explicit habit-scoped ranges: a rolling window for insights
 * and the complete range from creation for History. `getTracking` would pull
 * every habit, so this query narrows with the `by_habit_and_date` index.
 *
 * Rows carry `_creationTime`, which the insight layer uses as a proxy for
 * "when did you actually tick this off" — see `insights/dayparts.ts`.
 */
import { v } from 'convex/values';
import { query } from '../_generated/server';
import { trackingRecordValidator } from './types';

export const getHabitTracking = query({
  args: {
    endDate: v.string(),
    habitId: v.id('habits'),
    startDate: v.string(),
  },
  handler: async (ctx, args) => {
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    // SEC-001: Ownership verification — prevent cross-user data leakage
    const habit = await ctx.db.get(args.habitId);
    if (!habit || habit.userId !== identity.subject) return [];

    const ascending = args.startDate <= args.endDate;
    const startDate = ascending ? args.startDate : args.endDate;
    const endDate = ascending ? args.endDate : args.startDate;

    return await ctx.db
      .query('tracking')
      .withIndex('by_habit_and_date', (q) =>
        q
          .eq('habitId', args.habitId)
          .gte('date', startDate)
          .lte('date', endDate)
      )
      .collect();
  },
  returns: v.array(trackingRecordValidator),
});
