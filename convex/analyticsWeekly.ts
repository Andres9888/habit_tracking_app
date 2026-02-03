/**
 * Analytics weekly insights query
 *
 * Week-over-week comparison and habit change analysis.
 */

import { v } from 'convex/values';
import { query, internalMutation } from './_generated/server';
import { Doc } from './_generated/dataModel';
import { getStreaksForHabit } from './analytics/index';
import {
  calculateHabitChanges,
  categorizeHabitChanges,
  calculateWeekOverWeekChange,
} from './analytics/weeklyHelpers';

/**
 * Get weekly insights
 */
export const getWeeklyInsights = query({
  args: {},
  handler: async (ctx) => {
    const habits = await ctx.db.query('habits').collect();
    const activeHabits = habits.filter((h) => !h.archived && !h.paused);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    // Get all trackings for these habits
    const trackings: Doc<'tracking'>[] = [];
    for (const habit of activeHabits) {
      const habitTrackings = await ctx.db
        .query('tracking')
        .withIndex('by_habit_and_date', (q) => q.eq('habitId', habit._id))
        .collect();
      trackings.push(...habitTrackings);
    }

    // Calculate changes for each habit
    const habitChanges = await Promise.all(
      activeHabits.map(async (habit) => {
        const streaks = await getStreaksForHabit(ctx, habit._id, 'anonymous');
        return calculateHabitChanges(
          habit,
          trackings,
          oneWeekAgo,
          twoWeeksAgo,
          streaks.currentStreak
        );
      })
    );

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
