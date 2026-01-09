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
    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
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
    const allHabits = await ctx.db.query('habits').collect();
    const maxOrder = findMaxOrder(allHabits);

    // Recreate the habit with proper order and initialize strength
    const habitId = await ctx.db.insert('habits', {
      ...args.habitData,
      order: maxOrder + 1,
      strength: 0,
      strengthLevel: 'starting',
      strengthUpdatedAt: Date.now(),
    });

    // Recreate all tracking data
    for (const trackingEntry of args.trackingData) {
      await ctx.db.insert('tracking', {
        completed: trackingEntry.completed,
        date: trackingEntry.date,
        habitId,
      });
    }

    return habitId;
  },
  returns: v.id('habits'),
});
