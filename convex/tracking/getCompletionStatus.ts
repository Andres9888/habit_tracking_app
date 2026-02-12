import { v } from 'convex/values';
import { query } from '../_generated/server';
import { DATE_FORMAT_REGEX } from './helpers';

/**
 * Get completion status for a habit on a specific date.
 *
 * Returns true only if a tracking record exists AND completed is true.
 */
export const getCompletionStatus = query({
  args: {
    date: v.string(),
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error(
        'Unauthenticated: Must be logged in to check completion status'
      );
    }

    if (!DATE_FORMAT_REGEX.test(args.date)) {
      throw new Error('Invalid date format. Expected YYYY-MM-DD');
    }

    // SEC-001: Ownership verification
    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }
    if (habit.userId !== identity.subject) {
      throw new Error(
        'Not authorized to view completion status for this habit'
      );
    }

    const existingRecord = await ctx.db
      .query('tracking')
      .withIndex('by_habit_and_date', (q) =>
        q.eq('habitId', args.habitId).eq('date', args.date)
      )
      .unique();

    return existingRecord?.completed ?? false;
  },
  returns: v.boolean(),
});
