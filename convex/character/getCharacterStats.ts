/**
 * Character stats query
 */

import { query } from '../_generated/server';
import { characterStatsValidator, DEFAULT_CHARACTER_STATS } from './types';
import {
  calculateHabitStreaks,
  calculateTotalXP,
  calculateLevel,
  getTitle,
} from './calculations';
import { calculateAttributes } from './attributes';

export const getCharacterStats = query({
  args: {},
  handler: async (ctx) => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) return DEFAULT_CHARACTER_STATS;
      const userId = identity.subject;

      const habits = await ctx.db
        .query('habits')
        .withIndex('by_userId', (q) => q.eq('userId', userId))
        .filter((q) => q.neq(q.field('archived'), true))
        .collect();

      const allTracking = await ctx.db
        .query('tracking')
        .withIndex('by_user_and_date', (q) => q.eq('userId', userId))
        .collect();

      const { habitStreaks, maxStreak } = calculateHabitStreaks(
        habits,
        allTracking
      );
      const totalXP = calculateTotalXP(habits, allTracking, habitStreaks);
      const { level, xpInCurrentLevel, xpNeededForNextLevel } =
        calculateLevel(totalXP);
      const attributes = calculateAttributes(habits, allTracking, habitStreaks);
      const title = getTitle(level);

      const totalPower =
        attributes.vitality +
        attributes.strength +
        attributes.wisdom +
        attributes.energy;

      return {
        attributes,
        level,
        stats: {
          activeHabits: habits.length,
          dayStreak: maxStreak,
          totalPower,
        },
        title,
        totalXP,
        xp: xpInCurrentLevel,
        xpToNextLevel: xpNeededForNextLevel,
      };
    } catch (error) {
      // Error handled by returning default stats
      return DEFAULT_CHARACTER_STATS;
    }
  },
  returns: characterStatsValidator,
});
