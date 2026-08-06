/**
 * Recalculate Habit Strength Mutation
 * Recalculate strength for all past tracking data
 */
import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { getTrackingCutoffKey } from '../habits/utils';
import { resolveAlgorithmMode } from './algorithmConfig';
import { calculateMomentumStrengthSnapshot } from './momentum';

export const recalculateHabitStrength = mutation({
  args: {
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to recalculate strength');
    }

    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }

    if (habit.userId !== identity.subject) {
      throw new Error('Not authorized to recalculate this habit');
    }

    // Bounded — see getTrackingCutoffKey. Only a strength snapshot is derived.
    const tracking = await ctx.db
      .query('tracking')
      .withIndex('by_habit_and_date', (q) =>
        q.eq('habitId', args.habitId).gte('date', getTrackingCutoffKey())
      )
      .collect();

    // Resolve algorithm mode from per-habit setting, fallback 'balanced'
    const mode = resolveAlgorithmMode(habit.strengthAlgorithm);

    const snapshot = calculateMomentumStrengthSnapshot({
      habitCreatedAt: habit.createdAt,
      mode,
      tracking: tracking.map((entry) => ({
        completed: entry.completed,
        date: entry.date,
      })),
    });

    await ctx.db.patch(args.habitId, {
      strength: snapshot.strength,
      strengthLevel: snapshot.strengthLevel,
      strengthUpdatedAt: Date.now(),
    });

    return {
      daysProcessed: snapshot.daysProcessed,
      strength: snapshot.strength,
      strengthLevel: snapshot.strengthLevel,
    };
  },
  returns: v.object({
    daysProcessed: v.number(),
    strength: v.number(),
    strengthLevel: v.string(),
  }),
});
