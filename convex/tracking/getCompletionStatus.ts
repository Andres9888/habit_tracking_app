import { v } from 'convex/values';
import { query } from '../_generated/server';
import { DATE_FORMAT_REGEX } from './helpers';

/**
 * Get completion status for a habit on a specific date.
 *
 * Returns true if a tracking record exists (habit is completed),
 * false if no record exists (habit is not completed).
 */
export const getCompletionStatus = query({
  args: {
    date: v.string(),
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    if (!DATE_FORMAT_REGEX.test(args.date)) {
      throw new Error('Invalid date format. Expected YYYY-MM-DD');
    }

    const existingRecord = await ctx.db
      .query('tracking')
      .withIndex('by_habit_and_date', (q) =>
        q.eq('habitId', args.habitId).eq('date', args.date)
      )
      .unique();

    return existingRecord !== null;
  },
  returns: v.boolean(),
});
