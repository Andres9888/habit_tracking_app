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
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to view analytics');
    }

    // SEC-001: Filter habits by authenticated user
    const habits = await ctx.db
      .query('habits')
      .filter((q) => q.eq(q.field('userId'), identity.subject))
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
