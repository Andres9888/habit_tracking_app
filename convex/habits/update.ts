/**
 * Habit Update Mutations
 * Update habit properties (name, notes, settings, etc.)
 */
import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { updateHabitArgs } from './types';

export const update = mutation({
  args: updateHabitArgs,
  handler: async (ctx, args) => {
    // SEC-003: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to update habits');
    }

    const { habitId, ...updates } = args;

    // SEC-003: Ownership verification
    const habit = await ctx.db.get(habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }
    if (habit.userId !== identity.subject) {
      throw new Error('Not authorized to modify this habit');
    }

    // Remove undefined fields
    const cleanedUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );

    await ctx.db.patch(habitId, cleanedUpdates);
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
    // SEC-003: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to update habit notes');
    }

    // SEC-003: Ownership verification
    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }
    if (habit.userId !== identity.subject) {
      throw new Error('Not authorized to modify this habit');
    }

    await ctx.db.patch(args.habitId, {
      notes: args.notes,
    });
    return null;
  },
  returns: v.null(),
});
