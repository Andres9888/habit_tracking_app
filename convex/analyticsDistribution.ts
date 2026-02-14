/**
 * Analytics strength distribution query
 *
 * Categorizes habits by strength level for donut chart visualization.
 */

import { query } from './_generated/server';

/**
 * Get strength distribution for donut chart
 */
export const getStrengthDistribution = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      const empty = { count: 0, emoji: '', percentage: 0 };
      return {
        automatic: { ...empty, emoji: '⚡' },
        building: { ...empty, emoji: '🌿' },
        developing: { ...empty, emoji: '🌳' },
        starting: { ...empty, emoji: '🌱' },
        strong: { ...empty, emoji: '💪' },
        total: 0,
      };
    }

    // PERF FIX: Use by_userId index instead of full table scan
    const habits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
      .collect();
    const activeHabits = habits.filter((h) => !h.archived && !h.paused);

    // Categorize by strength level
    const distribution = {
      automatic: 0,

      // 🌳 40-60%
      building: 0,

      // ⚡ 60-80%
      developing: 0,

      // 🌿 20-40%
      starting: 0,
      // 💪 80-100%
      strong: 0, // 🌱 0-20%
    };

    for (const habit of activeHabits) {
      const strength = habit.strength ? habit.strength * 100 : 0;
      if (strength >= 80) distribution.automatic++;
      else if (strength >= 60) distribution.strong++;
      else if (strength >= 40) distribution.developing++;
      else if (strength >= 20) distribution.building++;
      else distribution.starting++;
    }

    const total = activeHabits.length || 1;

    return {
      automatic: {
        count: distribution.automatic,
        emoji: '⚡',
        percentage: (distribution.automatic / total) * 100,
      },
      building: {
        count: distribution.building,
        emoji: '🌿',
        percentage: (distribution.building / total) * 100,
      },
      developing: {
        count: distribution.developing,
        emoji: '🌳',
        percentage: (distribution.developing / total) * 100,
      },
      starting: {
        count: distribution.starting,
        emoji: '🌱',
        percentage: (distribution.starting / total) * 100,
      },
      strong: {
        count: distribution.strong,
        emoji: '💪',
        percentage: (distribution.strong / total) * 100,
      },
      total: total,
    };
  },
});
