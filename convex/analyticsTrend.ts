/**
 * Analytics trend data query
 *
 * Provides 30-day trend data for line chart visualization.
 */

import { query } from './_generated/server';
import { Doc } from './_generated/dataModel';
import { getDateString, getDaysAgo } from './analytics/index';

/**
 * Get 30-day trend data for line chart
 *
 * PERF FIX: Replaced N+1 query pattern with single batch query.
 * Also filters by userId for security and performance.
 */
export const get30DayTrend = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const habits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
      .collect();
    const activeHabits = habits.filter((h) => !h.archived && !h.paused);
    const habitIds = activeHabits.map((h) => h._id);

    // PERF: Fetch all trackings for user in one query instead of looping per habit
    const trackings: Doc<'tracking'>[] = await ctx.db
      .query('tracking')
      .withIndex('by_user_and_date', (q) => q.eq('userId', identity.subject))
      .collect();

    // Build trend data for last 30 days
    const trendData: Array<{ date: string; averageStrength: number }> = [];

    for (let i = 29; i >= 0; i--) {
      const date = getDaysAgo(i);
      const dateStr = getDateString(date);

      const dayCompletions = trackings.filter(
        (t) => t.date === dateStr && t.completed && habitIds.includes(t.habitId)
      );

      const completionRate =
        activeHabits.length > 0
          ? (dayCompletions.length / activeHabits.length) * 100
          : 0;

      trendData.push({
        averageStrength: completionRate,
        date: dateStr,
      });
    }

    return trendData;
  },
});
