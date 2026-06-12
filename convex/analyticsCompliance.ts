/**
 * Analytics compliance heatmap query
 *
 * Provides 90-day compliance data for heatmap visualization.
 */

import { query } from './_generated/server';
import type { Doc, Id } from './_generated/dataModel';
import {
  getDateString,
  getDaysAgo,
  getCompletionLevel,
} from './analytics/index';

/**
 * Pure computation of 90-day heatmap data from already-fetched habits/tracking.
 * Shared by getComplianceData and getAnalyticsDashboard.
 */
export function computeCompliance(
  activeHabits: Array<{ _id: Id<'habits'> }>,
  trackings: Doc<'tracking'>[]
) {
  const habitIds = new Set(activeHabits.map((h) => h._id));
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
      (t) => t.date === dateStr && t.completed && habitIds.has(t.habitId)
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
}

/**
 * Get compliance data for heatmap (90 days)
 *
 * PERF: Single user-level tracking query bounded to the 90-day window.
 */
export const getComplianceData = query({
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

    // PERF: Limit tracking query to 90-day window instead of loading all records
    const ninetyDaysAgoStr = getDateString(getDaysAgo(89));
    const allTrackings = await ctx.db
      .query('tracking')
      .withIndex('by_user_and_date', (q) =>
        q.eq('userId', identity.subject).gte('date', ninetyDaysAgoStr)
      )
      .collect();

    // Filter to only active habits
    const trackings = allTrackings.filter((t) => habitIds.has(t.habitId));

    return computeCompliance(activeHabits, trackings);
  },
});
