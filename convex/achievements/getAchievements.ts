/**
 * Achievements Query
 *
 * Returns all badges with unlock status and progress for the current user.
 */

import { query } from '../_generated/server';
import { v } from 'convex/values';
import { calculateHabitStreaks, calculateTotalXP, calculateLevel } from '../character/calculations';
import { calculateAttributes } from '../character/attributes';
import { calculateMetrics, evaluateBadges } from './evaluate';
import { BADGE_DEFINITIONS } from './badges';

const badgeValidator = v.object({
  badge: v.object({
    id: v.string(),
    name: v.string(),
    description: v.string(),
    icon: v.string(),
    category: v.string(),
    tier: v.string(),
    premium: v.boolean(),
    criteriaKey: v.string(),
    threshold: v.number(),
  }),
  unlocked: v.boolean(),
  progress: v.number(),
  current: v.number(),
});

export const getAchievements = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      // Return empty progress for unauthenticated users
      return BADGE_DEFINITIONS.map((badge) => ({
        badge,
        unlocked: false,
        progress: 0,
        current: 0,
      }));
    }

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

    const { habitStreaks, maxStreak } = calculateHabitStreaks(habits, allTracking);
    const totalXP = calculateTotalXP(habits, allTracking, habitStreaks);
    const { level } = calculateLevel(totalXP);
    const attributes = calculateAttributes(habits, allTracking, habitStreaks);
    const totalPower =
      attributes.vitality + attributes.strength + attributes.wisdom + attributes.energy;

    const metrics = calculateMetrics(habits, allTracking, level, totalPower, maxStreak);
    return evaluateBadges(metrics);
  },
  returns: v.array(badgeValidator),
});
