/**
 * Analytics compliance heatmap query
 *
 * Provides 90-day compliance data for heatmap visualization.
 */

import { query } from './_generated/server';
import { Doc } from './_generated/dataModel';
import {
  getDateString,
  getDaysAgo,
  getCompletionLevel,
} from './analytics/index';

/**
 * Get compliance data for heatmap (90 days)
 */
export const getComplianceData = query({
  args: {},
  handler: async (ctx) => {
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    // SEC-001: Filter by authenticated user to prevent data leakage
    const habits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
      .collect();
    const activeHabits = habits.filter((h) => !h.archived && !h.paused);
    const habitIds = activeHabits.map((h) => h._id);

    // PERF: Use single query with userId filter instead of N+1 queries
    const ninetyDaysAgo = getDaysAgo(89);
    const trackings: Doc<'tracking'>[] = await ctx.db
      .query('tracking')
      .withIndex('by_user_and_date', (q) =>
        q.eq('userId', identity.subject).gte('date', ninetyDaysAgo)
      )
      .collect();

    // Build heatmap data for last 90 days
    const heatmapData: Array<{
      date: string;
      completionRate: number;
      level: 'none' | 'low' | 'medium' | 'high';
      completedHabits: number;
      totalHabits: number;
    }> = [];

    for (let i = 89; i >= 0; i--) {
      const date = getDaysAgo(i);
      const dateStr = getDateString(date);

      const dayCompletions = trackings.filter(
        (t) => t.date === dateStr && t.completed && habitIds.includes(t.habitId)
      );

      const completionRate =
        activeHabits.length > 0
          ? (dayCompletions.length / activeHabits.length) * 100
          : 0;

      heatmapData.push({
        completedHabits: dayCompletions.length,
        completionRate,
        date: dateStr,
        level: getCompletionLevel(completionRate),
        totalHabits: activeHabits.length,
      });
    }

    return heatmapData;
  },
});
