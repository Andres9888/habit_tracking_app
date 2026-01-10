/**
 * 7-day predictions query
 *
 * Predict next 7 days of completion probability for a habit.
 * Based on Zhang et al. (2021) behavior prediction models.
 */

import { query } from './_generated/server';
import { v } from 'convex/values';
import {
  calculateTrend,
  calculateRisk,
  generateSuggestions,
} from './predictions/index';
import {
  generateDayPredictions,
  calculateOverallConfidence,
} from './predictions/dayPredictions';

/**
 * Predict next 7 days of completion probability for a habit
 */
export const predict7Days = query({
  args: { habitId: v.id('habits') },
  handler: async (ctx, args) => {
    const habit = await ctx.db.get(args.habitId);
    if (!habit) return null;

    const strength = habit.strength ?? 0;
    const accessibility = habit.accessibility ?? 1;

    const tracking = await ctx.db
      .query('tracking')
      .withIndex('by_habit_and_date', (q) => q.eq('habitId', args.habitId))
      .collect();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const last7Days = new Date(today);
    last7Days.setDate(today.getDate() - 7);

    const previous7Days = new Date(today);
    previous7Days.setDate(today.getDate() - 14);

    const recentCompletions = tracking.filter((t) => {
      const date = new Date(t.date);
      return date >= last7Days && date < today && t.completed;
    }).length;

    const previousCompletions = tracking.filter((t) => {
      const date = new Date(t.date);
      return date >= previous7Days && date < last7Days && t.completed;
    }).length;

    const trend = calculateTrend(
      strength,
      recentCompletions,
      previousCompletions
    );
    const riskLevel = calculateRisk(strength, recentCompletions);
    const predictions = generateDayPredictions(
      today,
      strength,
      accessibility,
      trend
    );

    const currentStrength = strength * 100;
    const avgPredictedProb =
      predictions.reduce((sum, p) => sum + p.probability, 0) /
      predictions.length;
    const predictedStrength = avgPredictedProb * 100;
    const overallConfidence = calculateOverallConfidence(tracking.length);
    const suggestions = generateSuggestions(riskLevel, strength, trend);

    return {
      confidence: Math.round(overallConfidence),
      currentStrength,
      habitId: args.habitId,
      predictedStrength,
      predictions,
      riskLevel,
      suggestions,
      trend,
    };
  },
  returns: v.union(
    v.null(),
    v.object({
      confidence: v.number(),
      currentStrength: v.number(),
      habitId: v.id('habits'),
      predictedStrength: v.number(),
      predictions: v.array(
        v.object({
          confidence: v.string(),
          date: v.string(),
          probability: v.number(),
        })
      ),
      riskLevel: v.string(),
      suggestions: v.array(v.string()),
      trend: v.string(),
    })
  ),
});
