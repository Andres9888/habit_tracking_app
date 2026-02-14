/**
 * Habit Soft Delete and Restoration
 * Soft-deletes habits (deleted:true flag) with 30-day retention before permanent cleanup.
 * Permanent cleanup is handled by habits/purgeDeleted.ts (cron job).
 */
import { v } from 'convex/values';
import { mutation, query } from '../_generated/server';
import { findMaxOrder } from './utils';

/** Thirty days in milliseconds */
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * Soft-delete a habit: sets deleted:true + deletedAt timestamp.
 * The habit and its data are retained for 30 days, then permanently removed by the scheduled cleanup.
 */
export const remove = mutation({
  args: {
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to delete habits');
    }

    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }

    if (habit.userId !== identity.subject) {
      throw new Error('Not authorized to delete this habit');
    }

    // Soft delete — mark as deleted instead of removing from DB
    await ctx.db.patch(args.habitId, {
      deleted: true,
      deletedAt: Date.now(),
    });

    return {
      habit: {
        createdAt: habit.createdAt,
        name: habit.name,
        notes: habit.notes,
      },
      tracking: [], // Data is retained — no need to return for undo
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
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to restore habits');
    }

    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }

    if (habit.userId !== identity.subject) {
      throw new Error('Not authorized to restore this habit');
    }

    if (habit.deleted !== true) {
      throw new Error('Habit is not deleted');
    }

    // Restore: clear deleted flag and place at end of order
    const activeHabits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
      .collect();
    const nonDeletedHabits = activeHabits.filter((h) => h.deleted !== true);

    await ctx.db.patch(args.habitId, {
      deleted: undefined,
      deletedAt: undefined,
      order: findMaxOrder(nonDeletedHabits) + 1,
    });

    return args.habitId;
  },
  returns: v.id('habits'),
});

/**
 * List soft-deleted habits for the authenticated user (for a "Recently Deleted" screen).
 */
export const listDeleted = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const habits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
      .collect();

    return habits
      .filter((h) => h.deleted === true)
      .map((h) => ({
        _id: h._id,
        deletedAt: h.deletedAt ?? 0,
        name: h.name,
        daysRemaining: h.deletedAt
          ? Math.max(
              0,
              Math.ceil(
                (h.deletedAt + THIRTY_DAYS_MS - Date.now()) /
                  (24 * 60 * 60 * 1000)
              )
            )
          : 0,
      }));
  },
  returns: v.array(
    v.object({
      _id: v.id('habits'),
      deletedAt: v.number(),
      name: v.string(),
      daysRemaining: v.number(),
    })
  ),
});
