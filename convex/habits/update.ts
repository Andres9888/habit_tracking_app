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
    const { habitId, ...updates } = args;

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
    await ctx.db.patch(args.habitId, {
      notes: args.notes,
    });
    return null;
  },
  returns: v.null(),
});
