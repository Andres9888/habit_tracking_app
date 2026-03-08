/* eslint-disable max-lines */
/**
 * Toggle Habit Completion Mutation
 * Mark a habit as completed/uncompleted for a given date
 */
import { v } from 'convex/values';
import { internal } from '../_generated/api';
import { internalMutation, mutation } from '../_generated/server';
import { calculateMomentumStrengthSnapshot } from '../habitStrength';
import { calculateStreakFromHistory } from '../streakUtils';
import {
  getTodayForTimezone,
  isFutureDate,
  isValidDateFormat,
  maxDateKey,
} from './utils';

export const toggleHabit = mutation({
  args: {
    date: v.string(),
    habitId: v.id('habits'),
    timezone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity)
      throw new Error('Unauthenticated: Must be logged in to toggle habits');
    if (!isValidDateFormat(args.date))
      throw new Error('Invalid date format; expected YYYY-MM-DD');
    if (isFutureDate(args.date))
      throw new Error('Cannot track habits for future dates');

    const habit = await ctx.db.get(args.habitId);
    if (!habit) throw new Error('Habit not found');
    if (!habit || habit.userId !== identity.subject)
      throw new Error('Not authorized to toggle this habit');

    const existing = await ctx.db
      .query('tracking')
      .withIndex('by_habit_and_date', (q) =>
        q.eq('habitId', args.habitId).eq('date', args.date)
      )
      .unique();

    const newCompletedStatus = existing ? !existing.completed : true;
    await (existing
      ? ctx.db.patch(existing._id, {
          completed: newCompletedStatus,
          // Backfill userId on legacy records missing it
          ...(existing.userId ? {} : { userId: identity.subject }),
        })
      : ctx.db.insert('tracking', {
          completed: true,
          date: args.date,
          habitId: args.habitId,
          userId: identity.subject,
        }));

    if (habit.pendingStrengthRecalcId) {
      try {
        await ctx.scheduler.cancel(habit.pendingStrengthRecalcId);
      } catch {
        // Ignore stale scheduled IDs that have already started or completed.
      }
    }

    const requestedAt = Date.now();
    const scheduledId = await ctx.scheduler.runAfter(
      500,
      internal.habits.toggle.recalculateStreakAndStrength,
      {
        date: args.date,
        habitId: args.habitId,
        requestedAt,
        timezone: args.timezone,
      }
    );
    await ctx.db.patch(args.habitId, {
      pendingStrengthRecalcId: scheduledId,
      pendingStrengthRecalcRequestedAt: requestedAt,
    });
    return null;
  },
  returns: v.null(),
});

/** Internal mutation: recalculate streak & strength after toggle. */
export const recalculateStreakAndStrength = internalMutation({
  args: {
    date: v.string(),
    habitId: v.id('habits'),
    requestedAt: v.number(),
    timezone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const habit = await ctx.db.get(args.habitId);
    if (!habit) return;
    if (habit.pendingStrengthRecalcRequestedAt !== args.requestedAt) return;

    const allTracking = await ctx.db
      .query('tracking')
      .withIndex('by_habit_and_date', (q) => q.eq('habitId', args.habitId))
      .collect();

    let maxTrackingDateKey = args.date;
    for (const record of allTracking)
      maxTrackingDateKey = maxDateKey(maxTrackingDateKey, record.date);
    const evaluationDateKey = maxDateKey(
      getTodayForTimezone(args.timezone),
      maxTrackingDateKey
    );

    const tracking = allTracking.map((r) => ({
      completed: r.completed,
      date: r.date,
    }));
    const snapshot = calculateMomentumStrengthSnapshot({
      habitCreatedAt: habit.createdAt,
      throughDate: evaluationDateKey,
      tracking,
    });

    // Pass pause info to streak calculation to exclude paused periods
    const streakData = calculateStreakFromHistory(tracking, evaluationDateKey, {
      pausedAt: habit.pausedAt,
      resumedAt: habit.resumedAt,
    });

    await ctx.db.patch(args.habitId, {
      bestStreak: streakData.bestStreak,
      currentStreak: streakData.currentStreak,
      lastCompletedDate: streakData.lastCompletedDate,
      pendingStrengthRecalcId: undefined,
      pendingStrengthRecalcRequestedAt: undefined,
      strength: snapshot.strength,
      strengthLevel: snapshot.strengthLevel,
      strengthUpdatedAt: Date.now(),
    });
  },
});
