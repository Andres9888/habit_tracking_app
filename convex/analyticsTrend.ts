/**
 * Analytics trend data query
 *
 * Provides 30-day trend data for line chart visualization.
 */

import { query } from './_generated/server';
import { getDateString, getDaysAgo } from './analytics/index';

/**
 * Get 30-day trend data for line chart
 */
export const get30DayTrend = query({
  args: {},
  handler: async (ctx) => {
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const habits = await ctx.db
      .query('habits')
      .filter((q) => q.eq(q.field('userId'), identity.subject))
      .collect();
    const activeHabits = habits.filter((h) => !h.archived && !h.paused);
    const habitIds = activeHabits.map((h) => h._id);

    // Get all trackings for these habits
    const trackings: any[] = [];
    for (const habitId of habitIds) {
      const habitTrackings = await ctx.db
        .query('tracking')
        .withIndex('by_habit_and_date', (q) => q.eq('habitId', habitId))
        .collect();
      trackings.push(...habitTrackings);
    }

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
