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
    console.log('reorderHabits called with:', args.habitIds.length, 'habits');

    // Validate input
    if (!args.habitIds || args.habitIds.length === 0) {
      console.error('No habit IDs provided');
      return null;
    }

    try {
      // Update each habit with its new order index
      for (let i = 0; i < args.habitIds.length; i++) {
        const habitId = args.habitIds[i];
        const habit = await ctx.db.get(habitId);

        if (habit) {
          await ctx.db.patch(habitId, {
            order: i,
          });
        } else {
          console.warn(`Habit ${habitId} not found`);
        }
      }

      console.log('Successfully reordered', args.habitIds.length, 'habits');
      return null;
    } catch (error) {
      console.error('Error in reorderHabits:', error);
      throw error;
    }
  },
  returns: v.null(),
});
