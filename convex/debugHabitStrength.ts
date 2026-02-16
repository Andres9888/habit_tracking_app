/**
 * Debug query to inspect habit strength values
 * Temporary file for troubleshooting - can be deleted later
 */

import { internalQuery } from './_generated/server';

export const inspectHabits = internalQuery({
  handler: async (ctx) => {
    const habits = await ctx.db
      .query('habits')
      .filter((q) => q.neq(q.field('archived'), true))
      .collect();

    return habits.map((habit) => ({
      habitDecayParam: habit.habitDecayParam ?? 'not set (should be 0.175)',
      habitGainParam: habit.habitGainParam ?? 'not set (should be 0.15)',
      id: habit._id,
      name: habit.name,
      strength: habit.strength ?? 0,
      strengthLevel: habit.strengthLevel ?? 'not set',
      strengthUpdatedAt: habit.strengthUpdatedAt
        ? new Date(habit.strengthUpdatedAt).toISOString()
        : 'never',
    }));
  },
});

export const inspectOneHabit = internalQuery({
  handler: async (ctx) => {
    const habits = await ctx.db
      .query('habits')
      .filter((q) => q.neq(q.field('archived'), true))
      .first();

    if (!habits) {
      return { error: 'No habits found' };
    }

    // Get tracking data
    const tracking = await ctx.db
      .query('tracking')
      .withIndex('by_habit_and_date', (q) => q.eq('habitId', habits._id))
      .collect();

    const completedDays = tracking.filter((t) => t.completed).length;
    const totalDays = tracking.length;

    return {
      completedDays,
      completionRate:
        totalDays > 0
          ? ((completedDays / totalDays) * 100).toFixed(1) + '%'
          : '0%',
      diagnosis:
        habits.strength === undefined || habits.strength === 0
          ? "⚠️ Strength not initialized. Click 'Initialize Now' button at top of app."
          : habits.strengthUpdatedAt === undefined
            ? '⚠️ Strength set but never updated. Try toggling a habit.'
            : '✅ Habit strength system is working!',
      habitName: habits.name,
      parameters: {
        HDP: habits.habitDecayParam ?? 0.175,
        HGP: habits.habitGainParam ?? 0.15,
      },
      strength: habits.strength ?? 0,
      strengthLevel: habits.strengthLevel ?? 'not set',
      strengthUpdatedAt: habits.strengthUpdatedAt
        ? new Date(habits.strengthUpdatedAt).toISOString()
        : 'never updated',
      totalDays,
    };
  },
});
