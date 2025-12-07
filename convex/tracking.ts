import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { calculateNewStrength, getStrengthLevel } from './habitStrength';

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
    date: v.string(),
    habitId: v.id('habits'),
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

    // Note: Date is provided by client in user's local timezone (YYYY-MM-DD).
    // We trust the client's date calculation to respect user's timezone context.
    // Format validation (YYYY-MM-DD regex above) is sufficient protection.
    // Server-side date range validation would cause false rejections for users
    // in timezones behind UTC (e.g., PST user at 11:59pm would be rejected because
    // server in UTC calculates "tomorrow" as today).

    // Query for existing tracking record using the indexed lookup
    const existingRecord = await ctx.db
      .query('tracking')
      .withIndex('by_habit_and_date', (q) =>
        q.eq('habitId', args.habitId).eq('date', args.date)
      )
      .unique();

    // Determine new completion state and perform toggle
    let newCompletionState: boolean;
    if (existingRecord) {
      // Record exists - delete it (uncheck)
      await ctx.db.delete(existingRecord._id);
      newCompletionState = false;
    } else {
      // No record exists - create it (check)
      await ctx.db.insert('tracking', {
        completed: true,
        date: args.date,
        habitId: args.habitId,
      });
      newCompletionState = true;
    }

    // Calculate completionsLast7Days for streak shield (7 days before toggle date)
    const toggleDate = new Date(args.date);
    const sevenDaysAgo = new Date(toggleDate);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Query all tracking for this habit to count recent completions
    const allTracking = await ctx.db
      .query('tracking')
      .withIndex('by_habit_and_date', (q) => q.eq('habitId', args.habitId))
      .collect();

    // Count completions in last 7 days (not including toggle date)
    let completionsLast7Days = 0;
    for (const record of allTracking) {
      const recordDate = new Date(record.date);
      if (recordDate >= sevenDaysAgo && recordDate < toggleDate && record.completed) {
        completionsLast7Days++;
      }
    }

    // Get current strength (default to 0 for new habits)
    const currentStrength = habit.strength ?? 0;

    // Calculate new strength using momentum-based formula
    // Note: strength is stored as 0-1, but calculateNewStrength uses 0-100 scale
    const newStrength = calculateNewStrength(
      currentStrength * 100,
      newCompletionState,
      completionsLast7Days
    ) / 100;

    // Update habit with new strength and level
    const strengthLevel = getStrengthLevel(newStrength);
    await ctx.db.patch(args.habitId, {
      strength: newStrength,
      strengthLevel,
      strengthUpdatedAt: Date.now(),
    });

    console.log('🔧 Updated habit strength:', {
      habitName: habit.name,
      date: args.date,
      completed: newCompletionState,
      completionsLast7Days,
      previousStrength: `${(currentStrength * 100).toFixed(1)}%`,
      newStrength: `${(newStrength * 100).toFixed(1)}%`,
      strengthLevel,
    });

    return newCompletionState;
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
    date: v.string(),
    habitId: v.id('habits'),
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
