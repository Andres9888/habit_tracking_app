import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { DATE_FORMAT_REGEX } from './helpers';
import { updateHabitStrength } from './strengthUpdater';

/**
 * Toggle completion status for a habit on a specific date.
 */
export const toggleCompletion = mutation({
  args: {
    date: v.string(),
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    if (!DATE_FORMAT_REGEX.test(args.date)) {
      throw new Error('Invalid date format. Expected YYYY-MM-DD');
    }

    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }

    const existingRecord = await ctx.db
      .query('tracking')
      .withIndex('by_habit_and_date', (q) =>
        q.eq('habitId', args.habitId).eq('date', args.date)
      )
      .unique();

    let newCompletionState: boolean;
    if (existingRecord) {
      await ctx.db.delete(existingRecord._id);
      newCompletionState = false;
    } else {
      await ctx.db.insert('tracking', {
        completed: true,
        date: args.date,
        habitId: args.habitId,
      });
      newCompletionState = true;
    }

    await updateHabitStrength({
      ctx,
      currentStrength: habit.strength ?? 0,
      habitCreatedAt: habit.createdAt,
      habitId: args.habitId,
      toggleDate: args.date,
    });

    return newCompletionState;
  },
  returns: v.boolean(),
});
