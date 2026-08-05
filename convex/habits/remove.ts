/* eslint-disable max-lines */
/**
 * Habit Removal and Restoration
 * Delete habits with undo support
 */
import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { findMaxOrder } from './utils';

const UNDO_RETENTION_MS = 15 * 60 * 1000;

interface RemovedHabitPayload {
  habit: {
    accessibilityAtPause?: number;
    bestStreak?: number;
    color?: string;
    createdAt: number;
    currentStreak?: number;
    cueAfterBehavior?: string;
    cueLocation?: string;
    cueTime?: string;
    daysOfWeek?: number[];
    frequency?: string;
    goalDuration?: number;
    goalUnit?: string;
    growthType?: 'simple' | 'average' | 'complex';
    icon?: string;
    iconColor?: string;
    identity?: string;
    lastCompletedDate?: string;
    name: string;
    notes?: string;
    paused?: boolean;
    pausedAt?: number;
    preferredTime?: string;
    remindersEnabled?: boolean;
    resumedAt?: number;
    reminderSound?: string;
    reminderTime?: string;
    strength?: number;
    strengthAtPause?: number;
    strengthLevel?: string;
    tags?: string[];
    vizFailureBody?: string;
    vizFailureEmotion?: string;
    vizFailureMind?: string;
    vizSuccessBody?: string;
    vizSuccessEmotion?: string;
    vizSuccessMind?: string;
    why?: string;
    woopObstacle?: string;
    woopOutcome?: string;
    woopPlan?: string;
    woopWish?: string;
  };
  tracking: Array<{
    completed: boolean;
    date: string;
  }>;
}

export const remove = mutation({
  args: {
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    // SEC-004: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to delete habits');
    }

    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }

    // SEC-004: Ownership verification
    if (habit.userId !== identity.subject) {
      throw new Error('Not authorized to delete this habit');
    }

    // Get all related data before deleting
    const trackingEntries = await ctx.db
      .query('tracking')
      .withIndex('by_habit_and_date', (q) => q.eq('habitId', args.habitId))
      .collect();
    const templateUsageEntries = await ctx.db
      .query('templateUsage')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .collect();

    // Delete the habit permanently
    await ctx.db.delete(args.habitId);

    // Delete all related data for this habit
    for (const entry of trackingEntries) {
      await ctx.db.delete(entry._id);
    }
    for (const usageEntry of templateUsageEntries) {
      await ctx.db.delete(usageEntry._id);
    }

    const deletedHabitPayload: RemovedHabitPayload = {
      habit: {
        accessibilityAtPause: habit.accessibilityAtPause,
        bestStreak: habit.bestStreak,
        color: habit.color,
        createdAt: habit.createdAt,
        currentStreak: habit.currentStreak,
        cueAfterBehavior: habit.cueAfterBehavior,
        cueLocation: habit.cueLocation,
        cueTime: habit.cueTime,
        daysOfWeek: habit.daysOfWeek,
        frequency: habit.frequency,
        goalDuration: habit.goalDuration,
        goalUnit: habit.goalUnit,
        growthType: habit.growthType,
        icon: habit.icon,
        iconColor: habit.iconColor,
        identity: habit.identity,
        lastCompletedDate: habit.lastCompletedDate,
        name: habit.name,
        notes: habit.notes,
        paused: habit.paused,
        pausedAt: habit.pausedAt,
        preferredTime: habit.preferredTime,
        remindersEnabled: habit.remindersEnabled,
        resumedAt: habit.resumedAt,
        reminderSound: habit.reminderSound,
        reminderTime: habit.reminderTime,
        strength: habit.strength,
        strengthAtPause: habit.strengthAtPause,
        strengthLevel: habit.strengthLevel,
        tags: habit.tags,
        vizFailureBody: habit.vizFailureBody,
        vizFailureEmotion: habit.vizFailureEmotion,
        vizFailureMind: habit.vizFailureMind,
        vizSuccessBody: habit.vizSuccessBody,
        vizSuccessEmotion: habit.vizSuccessEmotion,
        vizSuccessMind: habit.vizSuccessMind,
        why: habit.why,
        woopObstacle: habit.woopObstacle,
        woopOutcome: habit.woopOutcome,
        woopPlan: habit.woopPlan,
        woopWish: habit.woopWish,
      },
      tracking: trackingEntries.map((entry) => ({
        completed: entry.completed,
        date: entry.date,
      })),
    };

    const deletedHabitId = await ctx.db.insert('deletedHabits', {
      createdAt: Date.now(),
      expiresAt: Date.now() + UNDO_RETENTION_MS,
      payload: JSON.stringify(deletedHabitPayload),
      userId: identity.subject,
    });

    return { deletedHabitId };
  },
  returns: v.object({ deletedHabitId: v.id('deletedHabits') }),
});

export const restore = mutation({
  args: {
    deletedHabitId: v.id('deletedHabits'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to restore habits');
    }

    const deletedHabit = await ctx.db.get(args.deletedHabitId);
    if (!deletedHabit || deletedHabit.userId !== identity.subject) {
      throw new Error('Deleted habit not found');
    }
    if (deletedHabit.expiresAt < Date.now()) {
      await ctx.db.delete(args.deletedHabitId);
      throw new Error('Undo window expired');
    }

    let payload: RemovedHabitPayload;
    try {
      payload = JSON.parse(deletedHabit.payload) as RemovedHabitPayload;
    } catch {
      await ctx.db.delete(args.deletedHabitId);
      throw new Error('Deleted habit data is corrupted');
    }

    const userHabits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
      .collect();
    const maxOrder = findMaxOrder(userHabits);

    const habitId = await ctx.db.insert('habits', {
      ...payload.habit,
      order: maxOrder + 1,
      strengthUpdatedAt: Date.now(),
      userId: identity.subject,
    });

    for (const trackingEntry of payload.tracking) {
      await ctx.db.insert('tracking', {
        completed: trackingEntry.completed,
        date: trackingEntry.date,
        habitId,
        userId: identity.subject,
      });
    }

    await ctx.db.delete(args.deletedHabitId);

    return habitId;
  },
  returns: v.id('habits'),
});
