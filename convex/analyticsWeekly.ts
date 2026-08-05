/**
 * Analytics weekly insights query
 *
 * Week-over-week comparison and habit change analysis.
 */

import { v } from 'convex/values';
import { query, internalMutation } from './_generated/server';
import {
  calculateHabitChanges,
  categorizeHabitChanges,
  calculateWeekOverWeekChange,
} from './analytics/weeklyHelpers';

/**
 * Get weekly insights
 *
 * PERF: Uses a single user-level tracking query and stored streak fields on the
 * habit documents to avoid recomputing streaks from all historical tracking.
 */
export const getWeeklyInsights = query({
  args: {},
  handler: async (ctx) => {
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

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    // Single query: fetch ALL tracking records for the user
    const trackings = await ctx.db
      .query('tracking')
      .withIndex('by_user_and_date', (q) => q.eq('userId', identity.subject))
      .collect();

    // Calculate changes for each habit (pure computation, no DB calls)
    const habitChanges = activeHabits.map((habit) => {
      return calculateHabitChanges(
        habit,
        trackings,
        oneWeekAgo,
        twoWeeksAgo,
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
