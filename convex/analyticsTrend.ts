/**
 * Analytics trend data query
 *
 * Provides 30-day trend data for line chart visualization.
 */

import { query } from './_generated/server';
import { getDateString, getDaysAgo } from './analytics/index';

/**
 * Get 30-day trend data for line chart
 *
 * PERF: Fixed N+1 query pattern — now uses single user-level tracking query
 * instead of one query per habit. Reduces DB operations from O(N) to O(1).
 */
export const get30DayTrend = query({
  args: {},
  handler: async (ctx) => {
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    // SEC-001: Query only current user's habits to prevent cross-user data leakage
    const habits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
      .collect();
    const activeHabits = habits.filter((h) => !h.archived && !h.paused);
    const habitIds = new Set(activeHabits.map((h) => h._id));

    // PERF: Single query for all user's tracking records instead of N queries
    const allTrackings = await ctx.db
      .query('tracking')
      .withIndex('by_user_and_date', (q) => q.eq('userId', identity.subject))
      .collect();

    // Filter to only active habits
    const trackings = allTrackings.filter((t) => habitIds.has(t.habitId));

    // Build trend data for last 30 days
    const trendData: Array<{ date: string; averageStrength: number }> = [];

    for (let i = 29; i >= 0; i--) {
      const date = getDaysAgo(i);
      const dateStr = getDateString(date);

      const dayCompletions = trackings.filter(
        (t) => t.date === dateStr && t.completed && habitIds.has(t.habitId)
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
