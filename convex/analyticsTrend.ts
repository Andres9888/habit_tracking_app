/**
 * Analytics trend data query
 *
 * Provides 30-day trend data for line chart visualization.
 */

import { query } from './_generated/server';
import type { Doc, Id } from './_generated/dataModel';
import { getDateString, getDaysAgo } from './analytics/index';

/**
 * Pure computation of 30-day trend data from already-fetched habits/tracking.
 * Shared by get30DayTrend and getAnalyticsDashboard.
 */
export function computeTrend(
  activeHabits: Array<{ _id: Id<'habits'> }>,
  trackings: Doc<'tracking'>[]
) {
  const habitIds = new Set(activeHabits.map((h) => h._id));
  const trendData: Array<{ date: string; averageStrength: number }> = [];

  // Bucket once, then O(1) per day — see the same fix in analyticsCompliance.
  const completionsByDate = new Map<string, number>();
  for (const t of trackings) {
    if (!t.completed || !habitIds.has(t.habitId)) continue;
    completionsByDate.set(t.date, (completionsByDate.get(t.date) ?? 0) + 1);
  }

  for (let i = 29; i >= 0; i--) {
    const date = getDaysAgo(i);
    const dateStr = getDateString(date);

    const completedCount = completionsByDate.get(dateStr) ?? 0;

    const completionRate =
      activeHabits.length > 0
        ? (completedCount / activeHabits.length) * 100
        : 0;

    trendData.push({
      averageStrength: completionRate,
      date: dateStr,
    });
  }

  return trendData;
}

/**
 * Get 30-day trend data for line chart
 *
 * PERF: Single user-level tracking query, bounded to the 30-day window so
 * payload size does not grow with account age.
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

    // PERF: bound the index range to the 30-day window
    const thirtyDaysAgoStr = getDateString(getDaysAgo(29));
    const allTrackings = await ctx.db
      .query('tracking')
      .withIndex('by_user_and_date', (q) =>
        q.eq('userId', identity.subject).gte('date', thirtyDaysAgoStr)
      )
      .collect();

    // Filter to only active habits
    const trackings = allTrackings.filter((t) => habitIds.has(t.habitId));

    return computeTrend(activeHabits, trackings);
  },
});
