/**
 * Update Habit Parameters Mutation
 * Update habit strength parameters for advanced users
 */
import { v } from 'convex/values';
import { mutation } from '../_generated/server';

export const updateHabitParameters = mutation({
  args: {
    habitDecayParam: v.optional(v.number()),
    habitGainParam: v.optional(v.number()),
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to update habit parameters');
    }

    const habit = await ctx.db.get(args.habitId);
    if (!habit) throw new Error('Habit not found');

    if (habit.userId !== identity.subject) {
      throw new Error('Not authorized to update this habit');
    }

    if (
      args.habitDecayParam !== undefined &&
      (args.habitDecayParam < 0 || args.habitDecayParam > 1)
    ) {
      throw new Error('Habit decay parameter must be between 0 and 1');
    }

    if (
      args.habitGainParam !== undefined &&
      (args.habitGainParam < 0 || args.habitGainParam > 1)
    ) {
      throw new Error('Habit gain parameter must be between 0 and 1');
    }

    await ctx.db.patch(args.habitId, {
      habitDecayParam: args.habitDecayParam,
      habitGainParam: args.habitGainParam,
    });

    return null;
  },
  returns: v.null(),
});
