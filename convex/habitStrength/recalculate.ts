/**
 * Recalculate Habit Strength Mutation
 * Recalculate strength for all past tracking data
 */
import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { calculateMomentumStrengthSnapshot } from './momentum';

export const recalculateHabitStrength = mutation({
  args: {
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }

    const tracking = await ctx.db
      .query('tracking')
      .withIndex('by_habit_and_date', (q) => q.eq('habitId', args.habitId))
      .collect();

    const snapshot = calculateMomentumStrengthSnapshot({
      habitCreatedAt: habit.createdAt,
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
