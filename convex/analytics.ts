/**
 * Analytics API
 *
 * Dashboard statistics, strength distribution, trends, and insights.
 *
 * Decomposed structure:
 * - analytics/ - Types and helpers
 * - analyticsOverview.ts - Overview and rankings
 * - analyticsDistribution.ts - Strength distribution
 * - analyticsTrend.ts - 30-day trend data
 * - analyticsCompliance.ts - 90-day compliance heatmap
 * - analyticsWeekly.ts - Weekly insights
 */

import { v } from 'convex/values';
import { query } from './_generated/server';
import { dateKeysEndingOn } from './analytics/dateKeys';
import { computeOverviewStats } from './analyticsOverview';
import { computeStrengthDistribution } from './analyticsDistribution';
import { computeTrend } from './analyticsTrend';
import { computeCompliance } from './analyticsCompliance';
import { computeWeeklyInsights } from './analyticsWeekly';
import { getTodayForTimezone } from './habits/utils';

// Re-export types and helpers
export * from './analytics/index';

// Overview and rankings
export { getOverviewStats } from './analyticsOverview';

// Distribution chart
export { getStrengthDistribution } from './analyticsDistribution';

// Trend data
export { get30DayTrend } from './analyticsTrend';

// Compliance heatmap
export { getComplianceData } from './analyticsCompliance';

// Weekly insights
export { getWeeklyInsights, generateWeeklyInsights } from './analyticsWeekly';

/**
 * Combined analytics dashboard query.
 *
 * PERF: The analytics screen previously subscribed to five separate queries,
 * each independently loading the user's habits (and most of them tracking).
 * This query loads habits once and one 90-day tracking window (the widest any
 * sub-report needs), then computes all five reports from the shared data.
 */
export const getAnalyticsDashboard = query({
  args: { timezone: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

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
    const trackings = allTrackings.filter((t) => habitIds.has(t.habitId));

    return {
      complianceData: computeCompliance(activeHabits, trackings, todayKey),
      overviewStats: computeOverviewStats(activeHabits),
      strengthDistribution: computeStrengthDistribution(activeHabits),
      trendData: computeTrend(activeHabits, trackings, todayKey),
      weeklyInsights: computeWeeklyInsights(activeHabits, trackings, todayKey),
    };
  },
});
