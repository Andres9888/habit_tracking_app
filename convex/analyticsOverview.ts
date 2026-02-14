/**
 * Analytics overview queries
 *
 * Dashboard overview and rankings statistics.
 */

import { query } from './_generated/server';
import {
  calculateHabitStrength,
  getStreaksForHabitsBatch,
} from './analytics/index';

/**
 * Get overview statistics for the analytics dashboard
 */
export const getOverviewStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return {
        averageStrength: 0,
        rankedHabits: [],
        strongestHabit: null,
        totalHabits: 0,
        weakestHabit: null,
      };
    }

    // PERF FIX: Use by_userId index instead of full table scan
    const habits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
      .collect();
    const activeHabits = habits.filter((h) => !h.archived && !h.paused);

    if (activeHabits.length === 0) {
      return {
        averageStrength: 0,
        rankedHabits: [],
        strongestHabit: null,
        totalHabits: 0,
        weakestHabit: null,
      };
    }

    // Calculate strengths with streaks — single batch query instead of N queries
    const streaksMap = await getStreaksForHabitsBatch(
      ctx,
      activeHabits.map((h) => h._id)
    );

    const habitsWithStrength = activeHabits.map((habit) => {
      const streaks = streaksMap.get(habit._id) ?? {
        currentStreak: 0,
        longestStreak: 0,
      };
      const strength = calculateHabitStrength(
        habit,
        streaks.currentStreak / 66
      );
      return {
        ...habit,
        currentStreak: streaks.currentStreak,
        longestStreak: streaks.longestStreak,
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
  },
});
