/**
 * Habit Statistics Query
 * Get streak and consistency stats for a habit
 *
 * Uses UTC-based YYYY-MM-DD string comparisons to avoid
 * timezone mismatches between Date parsing and server local time.
 */
import { v } from 'convex/values';
import { query } from '../_generated/server';
import { getTodayUTCDateKey, subtractDaysFromDateKey } from './utils';

export const getStats = query({
  args: { habitId: v.id('habits') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const habit = await ctx.db.get(args.habitId);
    if (!habit) return null;

    if (habit.userId !== identity.subject) return null;

    const tracking = await ctx.db
      .query('tracking')
      .withIndex('by_habit_and_date', (q) => q.eq('habitId', args.habitId))
      .collect();

    const completedDates = new Set(
      tracking.filter((t) => t.completed).map((t) => t.date)
    );

    const todayKey = getTodayUTCDateKey();
    let streak = 0;

    for (let i = 0; ; i++) {
      const expectedKey = subtractDaysFromDateKey(todayKey, i);
      if (completedDates.has(expectedKey)) {
        streak++;
      } else {
        break;
      }
    }

    const thirtyDaysAgoKey = subtractDaysFromDateKey(todayKey, 30);
    const recentCount = tracking.filter(
      (t) => t.completed && t.date > thirtyDaysAgoKey && t.date <= todayKey
    ).length;

    const consistency = Math.max(
      0,
      Math.min(100, Math.round((recentCount / 30) * 100))
    );

    return { consistency, streak };
  },
  returns: v.union(
    v.null(),
    v.object({ consistency: v.number(), streak: v.number() })
  ),
});
