/**
 * Get All Habits Strength Stats Query
 * Get strength statistics across all habits
 */
import { v } from 'convex/values';
import { query } from '../_generated/server';
import { getStrengthLevel } from './strengthLevel';
import type { StrengthLevel } from './types';

export const getAllHabitsStrengthStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { averageStrength: 0, levelDistribution: { automatic: 0, building: 0, developing: 0, starting: 0, strong: 0 }, strongestHabit: null, totalHabits: 0, weakestHabit: null };

    const habits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
      .filter((q) => q.neq(q.field('archived'), true))
      .collect();

    const stats = {
      averageStrength: 0,
      levelDistribution: {
        automatic: 0,
        building: 0,
        developing: 0,
        starting: 0,
        strong: 0,
      },
      strongestHabit: null as { name: string; strength: number } | null,
      totalHabits: habits.length,
      weakestHabit: null as { name: string; strength: number } | null,
    };

    if (habits.length === 0) return stats;

    let totalStrength = 0;
    let maxStrength = -1;
    let minStrength = 2;

    for (const habit of habits) {
      const strength = habit.strength ?? 0;
      totalStrength += strength;

      if (strength > maxStrength) {
        maxStrength = strength;
        stats.strongestHabit = { name: habit.name, strength };
      }

      if (strength < minStrength) {
        minStrength = strength;
        stats.weakestHabit = { name: habit.name, strength };
      }

      const level = habit.strengthLevel ?? getStrengthLevel(strength);
      stats.levelDistribution[level as StrengthLevel]++;
    }

    stats.averageStrength = totalStrength / habits.length;

    return stats;
  },
  returns: v.object({
    averageStrength: v.number(),
    levelDistribution: v.object({
      automatic: v.number(),
      building: v.number(),
      developing: v.number(),
      starting: v.number(),
      strong: v.number(),
    }),
    strongestHabit: v.union(
      v.null(),
      v.object({ name: v.string(), strength: v.number() })
    ),
    totalHabits: v.number(),
    weakestHabit: v.union(
      v.null(),
      v.object({ name: v.string(), strength: v.number() })
    ),
  }),
});
