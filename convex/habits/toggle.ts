/**
 * Toggle Habit Completion Mutation
 * Mark a habit as completed/uncompleted for a given date
 */
import { v } from 'convex/values';
import { internal } from '../_generated/api';
import { internalMutation, mutation } from '../_generated/server';
import { RATE_LIMITS, rateLimit } from '../lib/rateLimiter';
import { calculateMomentumStrengthSnapshot } from '../habitStrength';
import { calculateStreakFromHistory } from '../streakUtils';
import { getTodayForTimezone, isFutureDate, isValidDateFormat, maxDateKey } from './utils';

export const toggleHabit = mutation({
  args: { date: v.string(), habitId: v.id('habits'), timezone: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated: Must be logged in to toggle habits');

    // SEC-004: Rate limiting (100/min)
    await rateLimit(ctx.db, identity.subject, RATE_LIMITS.habitToggle);

    if (!isValidDateFormat(args.date)) throw new Error('Invalid date format; expected YYYY-MM-DD');
    if (isFutureDate(args.date)) throw new Error('Cannot track habits for future dates');

    const habit = await ctx.db.get(args.habitId);
    if (!habit) throw new Error('Habit not found');
    if (habit.userId !== identity.subject) throw new Error('Not authorized to toggle this habit');

    const existing = await ctx.db
      .query('tracking')
      .withIndex('by_habit_and_date', (q) => q.eq('habitId', args.habitId).eq('date', args.date))
      .unique();

    const newCompletedStatus = existing ? !existing.completed : true;
    await (existing
      ? ctx.db.patch(existing._id, {
          completed: newCompletedStatus,
          // Backfill userId on legacy records missing it
          ...(existing.userId ? {} : { userId: identity.subject }),
        })
      : ctx.db.insert('tracking', {
          completed: true, date: args.date, habitId: args.habitId, userId: identity.subject,
        }));

    await ctx.scheduler.runAfter(0, internal.habits.toggle.recalculateStreakAndStrength, {
      date: args.date, habitId: args.habitId, timezone: args.timezone,
    });
    return null;
  },
  returns: v.null(),
});

/** Internal mutation: recalculate streak & strength after toggle. */
export const recalculateStreakAndStrength = internalMutation({
  args: { date: v.string(), habitId: v.id('habits'), timezone: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const habit = await ctx.db.get(args.habitId);
    if (!habit) return;

    const allTracking = await ctx.db
      .query('tracking')
      .withIndex('by_habit_and_date', (q) => q.eq('habitId', args.habitId))
      .collect();

    let maxTrackingDateKey = args.date;
    for (const record of allTracking) maxTrackingDateKey = maxDateKey(maxTrackingDateKey, record.date);
    const evaluationDateKey = maxDateKey(getTodayForTimezone(args.timezone), maxTrackingDateKey);

    const tracking = allTracking.map((r) => ({ completed: r.completed, date: r.date }));
    const snapshot = calculateMomentumStrengthSnapshot({
      habitCreatedAt: habit.createdAt, throughDate: evaluationDateKey, tracking,
    });
    const streakData = calculateStreakFromHistory(tracking, evaluationDateKey);

    await ctx.db.patch(args.habitId, {
      bestStreak: streakData.bestStreak, currentStreak: streakData.currentStreak,
      lastCompletedDate: streakData.lastCompletedDate,
      strength: snapshot.strength, strengthLevel: snapshot.strengthLevel,
      strengthUpdatedAt: Date.now(),
    });
  },
});
