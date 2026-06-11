/**
 * Analytics overview queries
 *
 * Dashboard overview and rankings statistics.
 */

import { query } from './_generated/server';
import type { Doc } from './_generated/dataModel';
import { calculateHabitStrength } from './analytics/index';

const EMPTY_OVERVIEW = {
  averageStrength: 0,
  rankedHabits: [],
  strongestHabit: null,
  totalHabits: 0,
  weakestHabit: null,
};

/**
 * Pure computation for overview statistics from already-fetched habits.
 * Shared by getOverviewStats and getAnalyticsDashboard.
 */
export function computeOverviewStats(activeHabits: Doc<'habits'>[]) {
  if (activeHabits.length === 0) {
    return EMPTY_OVERVIEW;
  }

  const habitsWithStrength = activeHabits.map((habit) => {
      const currentStreak = habit.currentStreak ?? 0;
      const longestStreak = habit.bestStreak ?? 0;
      const strength =
        typeof habit.strength === 'number'
          ? habit.strength
          : calculateHabitStrength(habit, currentStreak / 66);
      return {
        ...habit,
        currentStreak,
        longestStreak,
        strength,
      };
    });

    habitsWithStrength.sort((a, b) => b.strength - a.strength);

    const totalStrength = habitsWithStrength.reduce(
      (sum, h) => sum + h.strength,
      0
    );
    const averageStrength = totalStrength / habitsWithStrength.length;

    const rankedHabits = habitsWithStrength.map((habit) => ({
      currentStreak: habit.currentStreak,
      emoji: habit.icon || '🎯',
      id: habit._id,
      isAtRisk: habit.currentStreak < 3,
      longestStreak: habit.longestStreak,
      name: habit.name,
      strength: habit.strength,
    }));

  const strongest = habitsWithStrength[0];
  const weakest = habitsWithStrength.at(-1);

  return {
    averageStrength,
    rankedHabits,
    strongestHabit: strongest
      ? {
          emoji: strongest.icon || '🎯',
          id: strongest._id,
          name: strongest.name,
          strength: strongest.strength,
        }
      : null,
    totalHabits: activeHabits.length,
    weakestHabit: weakest
      ? {
          emoji: weakest.icon || '🎯',
          id: weakest._id,
          name: weakest.name,
          strength: weakest.strength,
        }
      : null,
  };
}

/**
 * Get overview statistics for the analytics dashboard
 */
export const getOverviewStats = query({
  args: {},
  handler: async (ctx) => {
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return EMPTY_OVERVIEW;
    }

    // SEC-001: Query only current user's habits to prevent cross-user data leakage
    const habits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
      .collect();
    const activeHabits = habits.filter((h) => !h.archived && !h.paused);

    return computeOverviewStats(activeHabits);
  },
});
