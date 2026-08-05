/**
 * Analytics strength distribution query
 *
 * Categorizes habits by strength level for donut chart visualization.
 */

import { query } from './_generated/server';

export type StrengthBucket =
  | 'starting'
  | 'building'
  | 'developing'
  | 'strong'
  | 'automatic';

/**
 * Map a strength percentage (0-100) to its distribution bucket.
 * Ascending tiers: starting 0-20 🌱, building 20-40 🌿, developing 40-60 🌳,
 * strong 60-80 💪, automatic 80-100 ⚡.
 */
export function bucketStrengthLevel(strength: number): StrengthBucket {
  if (strength >= 80) return 'automatic';
  if (strength >= 60) return 'strong';
  if (strength >= 40) return 'developing';
  if (strength >= 20) return 'building';
  return 'starting';
}

/**
 * Pure computation for the strength distribution from already-fetched habits.
 * Shared by getStrengthDistribution and getAnalyticsDashboard.
 */
export function computeStrengthDistribution(
  activeHabits: Array<{ strength?: number }>
) {
  // Categorize by strength level (see bucketStrengthLevel for tier ranges)
  const distribution: Record<StrengthBucket, number> = {
    automatic: 0,
    building: 0,
    developing: 0,
    starting: 0,
    strong: 0,
  };

  for (const habit of activeHabits) {
    const strength = habit.strength ? habit.strength * 100 : 0;
    distribution[bucketStrengthLevel(strength)]++;
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
}

/**
 * Get strength distribution for donut chart
 */
export const getStrengthDistribution = query({
  args: {},
  handler: async (ctx) => {
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      // Preserve legacy unauthenticated shape (total: 0, not the || 1 divisor)
      return { ...computeStrengthDistribution([]), total: 0 };
    }

    // SEC-001: Query only current user's habits to prevent cross-user data leakage
    const habits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
      .collect();
    const activeHabits = habits.filter((h) => !h.archived && !h.paused);

    return computeStrengthDistribution(activeHabits);
  },
});
