/**
 * Analytics compliance heatmap query
 *
 * Provides 90-day compliance data for heatmap visualization.
 */

import { v } from 'convex/values';
import { query } from './_generated/server';
import type { Doc, Id } from './_generated/dataModel';
import { getCompletionLevel } from './analytics/index';
import { dateKeysEndingOn } from './analytics/dateKeys';
import { getTodayForTimezone } from './habits/utils';

/**
 * Pure computation of 90-day heatmap data from already-fetched habits/tracking.
 * Shared by getComplianceData and getAnalyticsDashboard.
 */
export function computeCompliance(
  activeHabits: Array<{ _id: Id<'habits'> }>,
  trackings: Doc<'tracking'>[],
  todayKey = getTodayForTimezone()
) {
  const habitIds = new Set(activeHabits.map((h) => h._id));
  const heatmapData: Array<{
    date: string;
    completionRate: number;
    level: 'none' | 'low' | 'medium' | 'high';
    completedHabits: number;
    totalHabits: number;
  }> = [];

  // One pass to bucket completions by date, then O(1) per day. The previous
  // shape re-scanned the whole tracking array once per day (90 full scans), so
  // cost was days x rows — millions of comparisons for an active account, on
  // every re-run of this reactive query.
  const completionsByDate = new Map<string, number>();
  for (const t of trackings) {
    if (!t.completed || !habitIds.has(t.habitId)) continue;
    completionsByDate.set(t.date, (completionsByDate.get(t.date) ?? 0) + 1);
  }

  for (const dateStr of dateKeysEndingOn(todayKey, 90)) {
    const completedCount = completionsByDate.get(dateStr) ?? 0;

    const completionRate =
      activeHabits.length > 0
        ? (completedCount / activeHabits.length) * 100
        : 0;

    heatmapData.push({
      completedHabits: completedCount,
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
  args: { timezone: v.optional(v.string()) },
  handler: async (ctx, args) => {
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

    const todayKey = getTodayForTimezone(args.timezone);
    const ninetyDaysAgoStr = dateKeysEndingOn(todayKey, 90)[0];
    const allTrackings = await ctx.db
      .query('tracking')
      .withIndex('by_user_and_date', (q) =>
        q.eq('userId', identity.subject).gte('date', ninetyDaysAgoStr)
      )
      .collect();

    // Filter to only active habits
    const trackings = allTrackings.filter((t) => habitIds.has(t.habitId));

    return computeCompliance(activeHabits, trackings, todayKey);
  },
});
