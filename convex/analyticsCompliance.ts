/**
 * Analytics compliance heatmap query
 *
 * Provides 90-day compliance data for heatmap visualization.
 *
 * PERF FIX: Replaced N+1 pattern (one query per habit) with a single
 * user-level query using by_user_and_date index + date-range bounds.
 * Also pre-indexes completions by date for O(1) day lookups instead of
 * O(T) linear scans per day.
 */

import { query } from './_generated/server';
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const habits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
      .collect();
    const activeHabits = habits.filter((h) => !h.archived && !h.paused);
    const habitIdSet = new Set(activeHabits.map((h) => String(h._id)));

    // Compute date bounds for the 90-day window
    const startDateStr = getDateString(getDaysAgo(89));
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

    // Build heatmap data for last 90 days
    const heatmapData: Array<{
      date: string;
      completionRate: number;
      level: 'none' | 'low' | 'medium' | 'high';
      completedHabits: number;
      totalHabits: number;
    }> = [];

    const totalHabits = activeHabits.length;
    for (let i = 89; i >= 0; i--) {
      const dateStr = getDateString(getDaysAgo(i));
      const completedHabits = completionsByDate.get(dateStr) ?? 0;
      const completionRate =
        totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0;

      heatmapData.push({
        completedHabits,
        completionRate,
        date: dateStr,
        level: getCompletionLevel(completionRate),
        totalHabits,
      });
    }

    return heatmapData;
  },
});
