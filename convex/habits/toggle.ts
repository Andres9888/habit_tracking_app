/**
 * Toggle Habit Completion Mutation
 * Mark a habit as completed/uncompleted for a given date
 */
import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { calculateMomentumStrengthSnapshot } from '../habitStrength';
import { calculateStreakFromHistory } from '../streakUtils';
import {
  getTodayDateKey,
  isFutureDate,
  isValidDateFormat,
  maxDateKey,
} from './utils';

export const toggleHabit = mutation({
  args: { date: v.string(), habitId: v.id('habits') },
  handler: async (ctx, args) => {
    if (!isValidDateFormat(args.date)) {
      throw new Error('Invalid date format; expected YYYY-MM-DD');
    }
    if (isFutureDate(args.date)) {
      throw new Error('Cannot track habits for future dates');
    }

    const existing = await ctx.db
      .query('tracking')
      .withIndex('by_habit_and_date', (q) =>
        q.eq('habitId', args.habitId).eq('date', args.date)
      )
      .unique();

    const newCompletedStatus = existing ? !existing.completed : true;

    await (existing
      ? ctx.db.patch(existing._id, { completed: newCompletedStatus })
      : ctx.db.insert('tracking', {
          completed: true,
          date: args.date,
          habitId: args.habitId,
        }));

    // Update habit strength and streak based on full tracking history
    const habit = await ctx.db.get(args.habitId);
    if (habit) {
      const allTracking = await ctx.db
        .query('tracking')
        .withIndex('by_habit_and_date', (q) => q.eq('habitId', args.habitId))
        .collect();

      let maxTrackingDateKey = args.date;
      for (const record of allTracking) {
        maxTrackingDateKey = maxDateKey(maxTrackingDateKey, record.date);
      }
      const evaluationDateKey = maxDateKey(
        getTodayDateKey(),
        maxTrackingDateKey
      );

      const snapshot = calculateMomentumStrengthSnapshot({
        habitCreatedAt: habit.createdAt,
        throughDate: evaluationDateKey,
        tracking: allTracking.map((r) => ({
          completed: r.completed,
          date: r.date,
        })),
      });

      const streakData = calculateStreakFromHistory(
        allTracking.map((t) => ({ completed: t.completed, date: t.date })),
        evaluationDateKey
      );

      await ctx.db.patch(args.habitId, {
        bestStreak: streakData.bestStreak,
        currentStreak: streakData.currentStreak,
        lastCompletedDate: streakData.lastCompletedDate,
        strength: snapshot.strength,
        strengthLevel: snapshot.strengthLevel,
        strengthUpdatedAt: Date.now(),
      });
    }

    return null;
  },
  returns: v.null(),
});
