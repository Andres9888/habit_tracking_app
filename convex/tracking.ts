import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

/**
 * Toggle completion status for a habit on a specific date.
 *
 * If a tracking record exists for the given habitId and date:
 * - Deletes the record (unchecks the habit)
 * - Returns false to indicate the habit is now unchecked
 *
 * If no tracking record exists:
 * - Creates a new record with completed: true
 * - Returns true to indicate the habit is now checked
 *
 * @param habitId - The ID of the habit to toggle
 * @param date - The date in YYYY-MM-DD format
 * @returns boolean - true if habit is now checked, false if unchecked
 */
export const toggleCompletion = mutation({
  args: {
    habitId: v.id('habits'),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(args.date)) {
      throw new Error('Invalid date format. Expected YYYY-MM-DD');
    }

    // Validate that the habit exists
    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }

    // Prevent future dates - only allow today or past dates
    const inputDate = new Date(args.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);

    if (inputDate > today) {
      throw new Error('Cannot track habits for future dates');
    }

    // Query for existing tracking record using the indexed lookup
    const existingRecord = await ctx.db
      .query('tracking')
      .withIndex('by_habit_and_date', (q) =>
        q.eq('habitId', args.habitId).eq('date', args.date)
      )
      .unique();

    if (existingRecord) {
      // Record exists - delete it (uncheck)
      await ctx.db.delete(existingRecord._id);
      return false;
    } else {
      // No record exists - create it (check)
      await ctx.db.insert('tracking', {
        habitId: args.habitId,
        date: args.date,
        completed: true,
      });
      return true;
    }
  },
  returns: v.boolean(),
});

/**
 * Get completion status for a habit on a specific date.
 *
 * Returns true if a tracking record exists (habit is completed),
 * false if no record exists (habit is not completed).
 *
 * This is used for determining haptic feedback intensity:
 * - If completed (true) → unchecking → Light haptic
 * - If not completed (false) → checking → Medium haptic
 *
 * @param habitId - The ID of the habit to check
 * @param date - The date in YYYY-MM-DD format
 * @returns boolean - true if habit is completed, false if not
 */
export const getCompletionStatus = query({
  args: {
    habitId: v.id('habits'),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(args.date)) {
      throw new Error('Invalid date format. Expected YYYY-MM-DD');
    }

    // Query for existing tracking record using the indexed lookup
    const existingRecord = await ctx.db
      .query('tracking')
      .withIndex('by_habit_and_date', (q) =>
        q.eq('habitId', args.habitId).eq('date', args.date)
      )
      .unique();

    // Return true if record exists (completed), false otherwise
    return existingRecord !== null;
  },
  returns: v.boolean(),
});
