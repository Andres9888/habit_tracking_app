/**
 * Habit Reordering Mutation
 * Reorder habits in the list view
 */
import { v } from 'convex/values';
import { mutation } from '../_generated/server';

export const reorderHabits = mutation({
  args: {
    habitIds: v.array(v.id('habits')),
  },
  handler: async (ctx, args) => {
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to reorder habits');
    }

    // Validate input
    if (!args.habitIds || args.habitIds.length === 0) {
      return null;
    }

    // SEC-001: Verify ownership of ALL habits before making any changes
    const habits = await Promise.all(args.habitIds.map((id) => ctx.db.get(id)));
    for (const [i, habit] of habits.entries()) {
      if (!habit) {
        throw new Error(`Habit ${args.habitIds[i]} not found`);
      }
      if (habit.userId !== identity.subject) {
        throw new Error('Not authorized to reorder this habit');
      }
    }

    // Update each habit with its new order index
    for (let i = 0; i < args.habitIds.length; i++) {
      await ctx.db.patch(args.habitIds[i], { order: i });
    }

    return null;
  },
  returns: v.null(),
});
