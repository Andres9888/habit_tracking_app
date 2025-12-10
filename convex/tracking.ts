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

    console.log('========== TOGGLE v5 ==========');
    console.log('Habit:', habit.name);
    console.log('Date:', args.date);
    console.log('Record exists?', !!existingRecord);
    console.log('Current strength:', `${((habit.strength ?? 0) * 100).toFixed(1)}%`);

    // Determine new completion state and perform toggle
    let newCompletionState: boolean;
    if (existingRecord) {
      // Record exists - delete it (uncheck)
      await ctx.db.delete(existingRecord._id);
      newCompletionState = false;
      console.log('  → Deleting record (TOGGLE OFF)');
    } else {
      // No record exists - create it (check)
      await ctx.db.insert('tracking', {
        completed: true,
        date: args.date,
        habitId: args.habitId,
      });
      newCompletionState = true;
      console.log('  → Creating record (TOGGLE ON)');
    }

    // Get all tracking records AFTER the toggle (reflects current state)
    const allTracking = await ctx.db
      .query('tracking')
      .withIndex('by_habit_and_date', (q) => q.eq('habitId', args.habitId))
      .collect();

    // Get all completion dates for this habit
    const completionDates = new Set(
      allTracking.filter((r) => r.completed).map((r) => r.date)
    );

    // Recalculate strength from scratch based on NUMBER of completions
    // Simple approach: Each completion adds a fixed amount, each miss subtracts
    // This ensures toggle ON/OFF always changes by the same amount
    const STRENGTH_PER_COMPLETION = 3; // 3% per completion (matches GROWTH_RATE * 100 at 0%)

    const totalCompletions = completionDates.size;

    // Simple linear calculation: more completions = higher strength
    // Capped at 100%, minimum 0%
    const newStrength100 = Math.min(100, Math.max(0, totalCompletions * STRENGTH_PER_COMPLETION));

    // Convert to 0-1 scale for storage
    const newStrength = newStrength100 / 100;

    const previousStrength = (habit.strength ?? 0) * 100;

    console.log('🔧 [v4] Strength calculation:', {
      action: newCompletionState ? 'TOGGLE ON' : 'TOGGLE OFF',
      totalCompletions,
      previousStrength: `${previousStrength.toFixed(1)}%`,
      newStrength: `${newStrength100.toFixed(1)}%`,
      change: `${(newStrength100 - previousStrength).toFixed(2)}%`,
    });

    // Update habit with new strength and level
    const strengthLevel = getStrengthLevel(newStrength);
    await ctx.db.patch(args.habitId, {
      strength: newStrength,
      strengthLevel,
      strengthUpdatedAt: Date.now(),
    });

    console.log('🔧 [v4] Updated habit:', {
      habitName: habit.name,
      date: args.date,
      action: newCompletionState ? 'COMPLETED' : 'UNCOMPLETED',
      strengthBefore: `${previousStrength.toFixed(1)}%`,
      strengthAfter: `${newStrength100.toFixed(1)}%`,
      strengthLevel,
      totalCompletions,
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
