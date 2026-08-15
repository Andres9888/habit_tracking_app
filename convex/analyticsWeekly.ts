/**
 * Analytics weekly insights query
 *
 * Week-over-week comparison and habit change analysis.
 */

import { v } from 'convex/values';
import { query, internalMutation } from './_generated/server';
import type { Doc } from './_generated/dataModel';
import {
  buildWeeklyCompletionIndex,
  calculateHabitChanges,
  categorizeHabitChanges,
  calculateWeekOverWeekChange,
} from './analytics/weeklyHelpers';
import { getRollingWeekBoundaryKeys } from './analytics/dateKeys';
import { getTodayForTimezone } from './habits/utils';

/**
 * Pure computation of weekly insights from already-fetched habits/tracking.
 * Shared by getWeeklyInsights and getAnalyticsDashboard. Tracking outside the
 * two-week window is ignored, so a wider superset (e.g. 90 days) is fine.
 */
export function computeWeeklyInsights(
  activeHabits: Doc<'habits'>[],
  trackings: Doc<'tracking'>[],
  todayKey = getTodayForTimezone()
) {
  const { lastWeekStartKey, thisWeekStartKey } =
    getRollingWeekBoundaryKeys(todayKey);
  const oneWeekAgoKey = thisWeekStartKey;
  const twoWeeksAgoKey = lastWeekStartKey;

  // Bucket the tracking rows once, then each habit is an O(1) lookup.
  const completionIndex = buildWeeklyCompletionIndex(
    trackings,
    oneWeekAgoKey,
    twoWeeksAgoKey
  );

  // Calculate changes for each habit (pure computation, no DB calls)
  const habitChanges = activeHabits.map((habit) => {
    return calculateHabitChanges(
      habit,
      completionIndex,
      habit.currentStreak ?? 0
    );
  });

  const categories = categorizeHabitChanges(habitChanges);
  const totals = calculateWeekOverWeekChange(habitChanges);

  return {
    ...categories,
    ...totals,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Get weekly insights
 *
 * PERF: Uses a single user-level tracking query and stored streak fields on the
 * habit documents to avoid recomputing streaks from all historical tracking.
 */
export const getWeeklyInsights = query({
  args: { timezone: v.optional(v.string()) },
  handler: async (ctx, args) => {
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    // SEC-001: Query only current user's habits to prevent cross-user data leakage
    const habits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
      .collect();
    const activeHabits = habits.filter((h) => !h.archived && !h.paused);

    // Bound the query to the comparison window so per-user payload size
    // does not grow unbounded with account age.
    const todayKey = getTodayForTimezone(args.timezone);
    const { lastWeekStartKey: twoWeeksAgoKey } =
      getRollingWeekBoundaryKeys(todayKey);
    const trackings = await ctx.db
      .query('tracking')
      .withIndex('by_user_and_date', (q) =>
        q.eq('userId', identity.subject).gte('date', twoWeeksAgoKey)
      )
      .collect();

    return computeWeeklyInsights(activeHabits, trackings, todayKey);
  },
});

/**
 * Scheduled function to generate weekly insights (to be called via cron)
 */
export const generateWeeklyInsights = internalMutation({
  args: { userId: v.string() },
  handler: async (_ctx, { userId }) => {
    const _insightData = {
      generatedAt: new Date().toISOString(),
      userId,
    };
    return { success: true };
  },
});
