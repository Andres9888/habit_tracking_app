/**
 * Habit Pause/Resume Mutations
 * Pause and resume habits with state preservation
 */
import { v } from 'convex/values';
import { mutation, query } from '../_generated/server';
import type { MutationCtx } from '../_generated/server';
import type { Id } from '../_generated/dataModel';
import { calculateStreakFromHistory } from '../streakUtils';
import { fullHabitValidator } from './types';
import { getTodayForTimezone, maxDateKey } from './utils';
import {
  calculateMomentumStrengthSnapshot,
  resolveAlgorithmMode,
  withDecayedStrength,
} from '../habitStrength';

/**
 * Internal function to recalculate streak and strength after pause/resume
 */
async function recalculateOnPauseChange(
  ctx: MutationCtx,
  habitId: Id<'habits'>,
  timezone?: string
): Promise<void> {
  const habit = await ctx.db.get(habitId);
  if (!habit) return;

  const allTracking = await ctx.db
    .query('tracking')
    .withIndex('by_habit_and_date', (q) => q.eq('habitId', habitId))
    .collect();

  const today = getTodayForTimezone(timezone);
  let maxTrackingDateKey = today;
  for (const record of allTracking) {
    maxTrackingDateKey = maxDateKey(maxTrackingDateKey, record.date);
  }
  const evaluationDateKey = maxDateKey(today, maxTrackingDateKey);

  const tracking = allTracking.map((r) => ({ completed: r.completed, date: r.date }));

  // Resolve algorithm mode from per-habit setting, fallback 'balanced'
  const mode = resolveAlgorithmMode(habit.strengthAlgorithm);

  const snapshot = calculateMomentumStrengthSnapshot({
    habitCreatedAt: habit.createdAt,
    mode,
    throughDate: evaluationDateKey,
    tracking,
  });

  // Pass pause info to exclude paused periods from streak
  const streakData = calculateStreakFromHistory(tracking, evaluationDateKey, {
    pausedAt: habit.pausedAt,
    resumedAt: habit.resumedAt,
    timezone,
  });

  await ctx.db.patch(habitId, {
    bestStreak: streakData.bestStreak,
    currentStreak: streakData.currentStreak,
    lastCompletedDate: streakData.lastCompletedDate,
    strength: snapshot.strength,
    strengthLevel: snapshot.strengthLevel,
    strengthUpdatedAt: Date.now(),
  });
}

export const pause = mutation({
  args: {
    habitId: v.id('habits'),
    timezone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to pause habits');
    }

    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }

    // SEC-001: Ownership verification
    if (habit.userId !== identity.subject) {
      throw new Error('Not authorized to pause this habit');
    }

    // Store pause metadata
    await ctx.db.patch(args.habitId, {
      accessibilityAtPause: habit.accessibility,
      paused: true,
      pausedAt: Date.now(),
      strengthAtPause: habit.strength,
    });

    // Recalculate streak to exclude paused period
    await recalculateOnPauseChange(ctx, args.habitId, args.timezone);

    return { habitId: args.habitId, success: true };
  },
  returns: v.object({
    habitId: v.id('habits'),
    success: v.boolean(),
  }),
});

export const resume = mutation({
  args: {
    habitId: v.id('habits'),
    timezone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to resume habits');
    }

    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }

    // SEC-001: Ownership verification
    if (habit.userId !== identity.subject) {
      throw new Error('Not authorized to resume this habit');
    }

    const now = Date.now();
    await ctx.db.patch(args.habitId, {
      paused: false,
      resumedAt: now,
      // Restore strength from before pause; preserve current value if pause
      // was taken before any strength snapshot existed.
      strength: habit.strengthAtPause ?? habit.strength,
      strengthLevel: habit.strengthLevel,
      accessibility: habit.accessibilityAtPause ?? habit.accessibility,
    });

    // Recalculate streak to include the post-pause period
    await recalculateOnPauseChange(ctx, args.habitId, args.timezone);

    return { habitId: args.habitId, success: true };
  },
  returns: v.object({
    habitId: v.id('habits'),
    success: v.boolean(),
  }),
});

export const listPaused = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const habits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
      .filter((q) => q.eq(q.field('paused'), true))
      .order('desc')
      .collect();
    return habits.map((h) => withDecayedStrength(h));
  },
  returns: v.array(fullHabitValidator),
});
