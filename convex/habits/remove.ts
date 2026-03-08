/* eslint-disable max-lines */
/**
 * Habit Removal and Restoration
 * Delete habits with undo support
 */
import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { removedHabitDataValidator } from './types';
import { findMaxOrder } from './utils';

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
    if (!habit || habit.userId !== identity.subject) {
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

    // Return the deleted data for potential undo — preserve all user-configured fields
    return {
      habit: {
        color: habit.color,
        createdAt: habit.createdAt,
        cueAfterBehavior: habit.cueAfterBehavior,
        cueLocation: habit.cueLocation,
        cueTime: habit.cueTime,
        daysOfWeek: habit.daysOfWeek,
        frequency: habit.frequency,
        goalDuration: habit.goalDuration,
        goalUnit: habit.goalUnit,
        icon: habit.icon,
        iconColor: habit.iconColor,
        identity: habit.identity,
        name: habit.name,
        notes: habit.notes,
        preferredTime: habit.preferredTime,
        remindersEnabled: habit.remindersEnabled,
        reminderSound: habit.reminderSound,
        reminderTime: habit.reminderTime,
        strength: habit.strength,
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
  },
  returns: v.object({
    habit: removedHabitDataValidator,
    tracking: v.array(
      v.object({
        completed: v.boolean(),
        date: v.string(),
      })
    ),
  }),
});

export const restore = mutation({
  args: {
    habitData: removedHabitDataValidator,
    trackingData: v.array(
      v.object({
        completed: v.boolean(),
        date: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // SEC-004: Authentication check - restored habit will belong to authenticated user
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to restore habits');
    }

    const userHabits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
      .collect();
    const maxOrder = findMaxOrder(userHabits);

    // Restore habit preserving all user-configured fields.
    // Strength is preserved from deletion so the user doesn't lose their progress.
    // SEC-004: Associate restored habit with authenticated user
    const habitId = await ctx.db.insert('habits', {
      ...args.habitData,
      order: maxOrder + 1,
      strengthUpdatedAt: Date.now(),
      userId: identity.subject,
    });

    // Recreate all tracking data
    for (const trackingEntry of args.trackingData) {
      await ctx.db.insert('tracking', {
        completed: trackingEntry.completed,
        date: trackingEntry.date,
        habitId,
        userId: identity.subject,
      });
    }

    return habitId;
  },
  returns: v.id('habits'),
});
