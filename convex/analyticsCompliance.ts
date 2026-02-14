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
 *
 * PERF FIX: Replaced N+1 query pattern with single batch query.
 * OLD: One query per habit (O(n) queries) → NEW: One query for all user data (O(1))
 * Also filters by userId to:
 * 1. Only fetch user's own habits (security)
 * 2. Use index for faster queries
 */
export const getComplianceData = query({
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
