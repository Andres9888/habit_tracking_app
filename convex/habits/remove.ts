/**
 * Habit Removal and Restoration
 * Soft delete habits with 30-day retention, plus permanent delete and restore
 */
import { v } from 'convex/values';
import { mutation, query } from '../_generated/server';
import { fullHabitValidator } from './types';
import { findMaxOrder } from './utils';

const RETENTION_DAYS = 30;

function requireAuth(identity: unknown, action: string) {
  if (!identity)
    throw new Error(`Unauthenticated: Must be logged in to ${action}`);
}

/**
 * Soft delete a habit — marks it as deleted with a timestamp.
 * Habit and tracking data are preserved for 30 days.
 */
export const remove = mutation({
  args: {
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    requireAuth(identity, 'delete habits');

    const habit = await ctx.db.get(args.habitId);
    if (!habit) throw new Error('Habit not found');
    if (habit.userId !== identity!.subject)
      throw new Error('Not authorized to delete this habit');

    await ctx.db.patch(args.habitId, {
      deleted: true,
      deletedAt: Date.now(),
    });

    // Return data for undo toast compatibility
    const trackingEntries = await ctx.db
      .query('tracking')
      .withIndex('by_habit_and_date', (q) => q.eq('habitId', args.habitId))
      .collect();

    return {
      habit: {
        createdAt: habit.createdAt,
        name: habit.name,
        notes: habit.notes,
      },
      tracking: trackingEntries.map((entry) => ({
        completed: entry.completed,
        date: entry.date,
      })),
    };
  },
  returns: v.object({
    habit: v.object({
      createdAt: v.number(),
      name: v.string(),
      notes: v.optional(v.string()),
    }),
    tracking: v.array(
      v.object({
        completed: v.boolean(),
        date: v.string(),
      })
    ),
  }),
});

/**
 * Restore a soft-deleted habit back to active state.
 */
export const restore = mutation({
  args: {
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    requireAuth(identity, 'restore habits');

    const habit = await ctx.db.get(args.habitId);
    if (!habit) throw new Error('Habit not found');
    if (habit.userId !== identity!.subject)
      throw new Error('Not authorized to restore this habit');
    if (habit.deleted !== true)
      throw new Error('Habit is not deleted');

    // Find max order among active habits
    const activeHabits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', identity!.subject))
      .filter((q) =>
        q.and(
          q.neq(q.field('archived'), true),
          q.neq(q.field('deleted'), true)
        )
      )
      .collect();

    await ctx.db.patch(args.habitId, {
      deleted: false,
      deletedAt: undefined,
      archived: false,
      archivedAt: undefined,
      order: findMaxOrder(activeHabits) + 1,
    });

    return args.habitId;
  },
  returns: v.id('habits'),
});

/**
 * Permanently delete a habit and all its tracking data.
 */
export const permanentlyDelete = mutation({
  args: {
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    requireAuth(identity, 'permanently delete habits');

    const habit = await ctx.db.get(args.habitId);
    if (!habit) throw new Error('Habit not found');
    if (habit.userId !== identity!.subject)
      throw new Error('Not authorized to delete this habit');

    // Delete all tracking data
    const trackingEntries = await ctx.db
      .query('tracking')
      .withIndex('by_habit_and_date', (q) => q.eq('habitId', args.habitId))
      .collect();

    for (const entry of trackingEntries) {
      await ctx.db.delete(entry._id);
    }

    // Delete related data (affirmations, reflections, notes, etc.)
    const affirmations = await ctx.db
      .query('affirmations')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .collect();
    for (const a of affirmations) await ctx.db.delete(a._id);

    const reflections = await ctx.db
      .query('reflections')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .collect();
    for (const r of reflections) await ctx.db.delete(r._id);

    // Delete the habit
    await ctx.db.delete(args.habitId);

    return null;
  },
  returns: v.null(),
});

/**
 * List all soft-deleted habits for the authenticated user.
 */
export const listDeleted = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    requireAuth(identity, 'view deleted habits');

    return await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', identity!.subject))
      .filter((q) => q.eq(q.field('deleted'), true))
      .collect();
  },
  returns: v.array(fullHabitValidator),
});

/**
 * Cleanup: permanently delete habits that have been soft-deleted for > 30 days.
 * Intended to be called by a cron job.
 */
export const cleanupExpiredDeleted = mutation({
  args: {},
  handler: async (ctx) => {
    const cutoff = Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000;

    const expiredHabits = await ctx.db
      .query('habits')
      .filter((q) =>
        q.and(
          q.eq(q.field('deleted'), true),
          q.lt(q.field('deletedAt'), cutoff)
        )
      )
      .collect();

    let deletedCount = 0;
    for (const habit of expiredHabits) {
      // Delete tracking data
      const trackingEntries = await ctx.db
        .query('tracking')
        .withIndex('by_habit_and_date', (q) => q.eq('habitId', habit._id))
        .collect();
      for (const entry of trackingEntries) await ctx.db.delete(entry._id);

      // Delete the habit
      await ctx.db.delete(habit._id);
      deletedCount++;
    }

    return { deletedCount };
  },
  returns: v.object({ deletedCount: v.number() }),
});
