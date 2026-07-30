/**
 * Habit Update Mutations
 * Update habit properties (name, notes, settings, etc.)
 */
import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import {
  calculateMomentumStrengthSnapshot,
  resolveAlgorithmMode,
} from '../habitStrength';
import { enforceRateLimit } from '../lib/rateLimit';
import { updateHabitArgs } from './types';
import {
  validateDaysOfWeek,
  validateEffortMinutes,
  validateHabitUpdateFields,
} from './validation';

export const update = mutation({
  args: updateHabitArgs,
  handler: async (ctx, args) => {
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to update habits');
    }

    const { habitId, ...updates } = args;

    // SEC-001: Ownership verification
    const habit = await ctx.db.get(habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }
    if (habit.userId !== identity.subject) {
      throw new Error('Not authorized to modify this habit');
    }

    // SR: throttle habit updates per user (limit key was defined but unwired).
    await enforceRateLimit(ctx, identity.subject, 'habit.update');

    // SEC-003: Input validation
    const validated = validateHabitUpdateFields(updates);
    validateDaysOfWeek(updates.daysOfWeek);
    validateEffortMinutes(updates.effortMinutes);

    // Merge strategy: non-string fields (booleans, arrays, numbers) in updateHabitArgs
    // are type-checked by Convex's `v` validators but bypass validateHabitUpdateFields
    // (which only sanitizes strings). If you add a new string field to updateHabitArgs,
    // add a corresponding validator to validateHabitUpdateFields so it gets sanitized.
    const cleanedUpdates = {
      ...Object.fromEntries(
        Object.entries(updates).filter(
          ([key, value]) =>
            value !== undefined && !Object.keys(validated).includes(key)
        )
      ),
      ...Object.fromEntries(
        Object.entries(validated).filter(([_, value]) => value !== undefined)
      ),
      ...(updates.effortMinutes === null ? { effortMinutes: undefined } : {}),
    };

    await ctx.db.patch(habitId, cleanedUpdates);

    // Recalculate strength when algorithm mode changes
    if (args.strengthAlgorithm !== undefined) {
      const updatedHabit = await ctx.db.get(habitId);
      if (updatedHabit) {
        const tracking = await ctx.db
          .query('tracking')
          .withIndex('by_habit_and_date', (q) => q.eq('habitId', habitId))
          .collect();

        const mode = resolveAlgorithmMode(updatedHabit.strengthAlgorithm);

        const snapshot = calculateMomentumStrengthSnapshot({
          habitCreatedAt: updatedHabit.createdAt,
          mode,
          tracking: tracking.map((t) => ({
            completed: t.completed,
            date: t.date,
          })),
        });

        await ctx.db.patch(habitId, {
          strength: snapshot.strength,
          strengthLevel: snapshot.strengthLevel,
          strengthUpdatedAt: Date.now(),
        });
      }
    }

    return null;
  },
  returns: v.null(),
});

export const updateNotes = mutation({
  args: {
    habitId: v.id('habits'),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error(
        'Unauthenticated: Must be logged in to update habit notes'
      );
    }

    // SEC-001: Ownership verification
    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }
    if (habit.userId !== identity.subject) {
      throw new Error('Not authorized to modify this habit');
    }

    // SR: throttle habit updates per user (limit key was defined but unwired).
    await enforceRateLimit(ctx, identity.subject, 'habit.update');

    // SEC-003: Input validation
    const validated = validateHabitUpdateFields({ notes: args.notes });

    await ctx.db.patch(args.habitId, {
      notes: validated.notes,
    });
    return null;
  },
  returns: v.null(),
});
