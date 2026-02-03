/**
 * Predictions at-risk queries
 *
 * Get habits with low predicted completion probability.
 */

import { query } from './_generated/server';
import { v } from 'convex/values';

/**
 * Get habits with low predicted completion probability
 * Returns habits below threshold for intervention widget
 */
export const getHabitsAtRisk = query({
  args: {
    threshold: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to view predictions');
    }

    const threshold = args.threshold ?? 0.4;

    // SEC-001: Filter habits by authenticated user
    const habits = await ctx.db
      .query('habits')
      .filter((q) => 
        q.and(
          q.eq(q.field('archived'), false),
          q.eq(q.field('userId'), identity.subject)
        )
      )
      .collect();

    const atRiskHabits = [];

    for (const habit of habits) {
      const strength = habit.strength ?? 0;
      const accessibility = habit.accessibility ?? 1;
      const predictedProbability = strength * accessibility;

      if (predictedProbability < threshold) {
        atRiskHabits.push({
          _id: habit._id,
          accessibility,
          icon: habit.icon ?? '📌',
          name: habit.name,
          predictedProbability,
          riskLevel: predictedProbability < 0.2 ? 'high' : 'medium',
          strength,
        });
      }
    }

    return atRiskHabits.sort(
      (a, b) => a.predictedProbability - b.predictedProbability
    );
  },
});

/**
 * Get predicted completion probability for a specific habit
 */
export const getHabitPrediction = query({
  args: {
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to view predictions');
    }

    const habit = await ctx.db.get(args.habitId);

    if (!habit || habit.archived) {
      return null;
    }

    // SEC-001: Ownership verification
    if (habit.userId !== identity.subject) {
      throw new Error('Not authorized to view this habit prediction');
    }

    const strength = habit.strength ?? 0;
    const accessibility = habit.accessibility ?? 1;
    const predictedProbability = strength * accessibility;

    const totalCompletions = habit.totalCompletions ?? 0;
    const confidence = Math.min(totalCompletions / 30, 1);

    return {
      accessibility,
      confidence,
      habitId: habit._id,
      habitName: habit.name,
      predictedProbability,
      riskLevel:
        predictedProbability < 0.2
          ? 'high'
          : predictedProbability < 0.4
            ? 'medium'
            : 'low',
      strength,
    };
  },
});
