/**
 * Habit Removal and Restoration
 * Delete habits with undo support
 */
import { v } from 'convex/values';
import { mutation } from '../_generated/server';
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
    if (habit.userId !== identity.subject) {
      throw new Error('Not authorized to delete this habit');
    }

    // Get all tracking data before deleting
    const trackingEntries = await ctx.db
      .query('tracking')
      .withIndex('by_habit_and_date', (q) => q.eq('habitId', args.habitId))
      .collect();

    // Delete the habit permanently
    await ctx.db.delete(args.habitId);

    // Delete all tracking data for this habit
    for (const entry of trackingEntries) {
      await ctx.db.delete(entry._id);
    }

    // Return the deleted data for potential undo
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

export const restore = mutation({
  args: {
    habitData: v.object({
      createdAt: v.number(),
      name: v.string(),
      notes: v.optional(v.string()),
    }),
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

    const allHabits = await ctx.db.query('habits').collect();
    const maxOrder = findMaxOrder(allHabits);

    // Recreate the habit with proper order and initialize strength
    // SEC-004: Associate restored habit with authenticated user
    const habitId = await ctx.db.insert('habits', {
      ...args.habitData,
      order: maxOrder + 1,
      strength: 0,
      strengthLevel: 'starting',
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
