/**
 * Get Habit Strength Info Query
 * Get detailed strength info including level details
 */
import { v } from 'convex/values';
import { query } from '../_generated/server';
import {
  COMPLIANCE_PRIOR_ALPHA,
  COMPLIANCE_PRIOR_BETA,
  COMPLIANCE_WINDOW_DAYS,
  LOGISTIC_MIDPOINT,
  LOGISTIC_SLOPE,
} from './constants';
import { startOfDay } from './dateUtils';
import { predictCompletionProbability } from './legacyFormula';
import { generateHabitStrengthSnapshot } from './snapshot';
import { STRENGTH_LEVELS } from './types';
import type { StrengthLevel } from './types';

export const getHabitStrengthInfo = query({
  args: {
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to view habit strength');
    }

    const habit = await ctx.db.get(args.habitId);
    if (!habit) throw new Error('Habit not found');

    if (habit.userId !== identity.subject) {
      throw new Error('Not authorized to view this habit');
    }

    const tracking = await ctx.db
      .query('tracking')
      .withIndex('by_habit_and_date', (q) => q.eq('habitId', args.habitId))
      .collect();

    const snapshot = generateHabitStrengthSnapshot({
      habitCreatedAt: habit.createdAt,
      throughDate: startOfDay(new Date()),
      tracking: tracking.map((t) => ({ completed: t.completed, date: t.date })),
    });

    const strength = habit.strength ?? snapshot.strength;
    const level = habit.strengthLevel ?? snapshot.strengthLevel;
    const levelInfo = STRENGTH_LEVELS[level as StrengthLevel];

    return {
      baseline: snapshot.baseline,
      compliance: snapshot.compliance,
      complianceSuccesses: snapshot.complianceSuccesses,
      complianceWindowDays: snapshot.complianceDaysConsidered,
      level,
      levelInfo,
      model: {
        compliancePriorAlpha: COMPLIANCE_PRIOR_ALPHA,
        compliancePriorBeta: COMPLIANCE_PRIOR_BETA,
        complianceWindowDays: COMPLIANCE_WINDOW_DAYS,
        logisticMidpoint: LOGISTIC_MIDPOINT,
        logisticSlope: LOGISTIC_SLOPE,
      },
      predictionProbability: predictCompletionProbability(strength),
      strength,
      updatedAt:
        habit.strengthUpdatedAt ?? snapshot.lastEvaluatedDate.getTime(),
    };
  },
  returns: v.object({
    baseline: v.number(),
    compliance: v.number(),
    complianceSuccesses: v.number(),
    complianceWindowDays: v.number(),
    level: v.string(),
    levelInfo: v.object({
      color: v.string(),
      description: v.string(),
      emoji: v.string(),
      label: v.string(),
      level: v.string(),
    }),
    model: v.object({
      compliancePriorAlpha: v.number(),
      compliancePriorBeta: v.number(),
      complianceWindowDays: v.number(),
      logisticMidpoint: v.number(),
      logisticSlope: v.number(),
    }),
    predictionProbability: v.number(),
    strength: v.number(),
    updatedAt: v.optional(v.number()),
  }),
});
