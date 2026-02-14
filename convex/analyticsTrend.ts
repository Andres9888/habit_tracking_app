/**
 * Analytics trend data query
 *
 * Provides 30-day trend data for line chart visualization.
 *
 * PERF FIX: Replaced N+1 pattern (one query per habit) with a single
 * user-level query using by_user_and_date index + date-range bounds.
 * Also pre-indexes completions by date for O(1) day lookups.
 */

import { query } from './_generated/server';
import { getDateString, getDaysAgo } from './analytics/index';

/**
 * Get 30-day trend data for line chart
 */
export const get30DayTrend = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const habits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
      .collect();
    const activeHabits = habits.filter((h) => !h.archived && !h.paused);
    const habitIdSet = new Set(activeHabits.map((h) => String(h._id)));

    // Compute date bounds for the 30-day window
    const startDateStr = getDateString(getDaysAgo(29));
    const endDateStr = getDateString(getDaysAgo(0));

    // PERF: Single user-level query with date-range bounds instead of N habit queries
    const trackings = await ctx.db
      .query('tracking')
      .withIndex('by_user_and_date', (q) =>
        q
          .eq('userId', identity.subject)
          .gte('date', startDateStr)
          .lte('date', endDateStr)
      )
      .collect();

    // Pre-index completions by date for O(1) lookups
    const completionsByDate = new Map<string, number>();
    for (const t of trackings) {
      if (t.completed && habitIdSet.has(String(t.habitId))) {
        completionsByDate.set(
          t.date,
          (completionsByDate.get(t.date) ?? 0) + 1
        );
      }
    }

    // Build trend data for last 30 days
    const totalHabits = activeHabits.length;
    const trendData: Array<{ date: string; averageStrength: number }> = [];

    for (let i = 29; i >= 0; i--) {
      const dateStr = getDateString(getDaysAgo(i));
      const completedCount = completionsByDate.get(dateStr) ?? 0;
      const completionRate =
        totalHabits > 0 ? (completedCount / totalHabits) * 100 : 0;

      trendData.push({
        averageStrength: completionRate,
        date: dateStr,
      });
    }

    return trendData;
  },
});
