/**
 * Habit Archive Mutations
 * Archive and unarchive habits, plus bulk delete
 */
import { v } from 'convex/values';
import { mutation, query } from '../_generated/server';
import { fullHabitValidator } from './types';
import { findMaxOrder } from './utils';

export const archive = mutation({
  args: {
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }

    await ctx.db.patch(args.habitId, {
      archived: true,
      archivedAt: Date.now(),
    });

    return null;
  },
  returns: v.null(),
});

export const unarchive = mutation({
  args: {
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }

    // Get all non-archived habits to determine next order value
    const activeHabits = await ctx.db
      .query('habits')
      .filter((q) => q.neq(q.field('archived'), true))
      .collect();
    const maxOrder = findMaxOrder(activeHabits);

    await ctx.db.patch(args.habitId, {
      archived: false,
      archivedAt: undefined,
      order: maxOrder + 1,
    });

    return null;
  },
  returns: v.null(),
});

export const listArchived = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('habits')
      .filter((q) => q.eq(q.field('archived'), true))
      .collect();
  },
  returns: v.array(fullHabitValidator),
});

export const deleteAllArchived = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to delete archived habits');
    }

    const archivedHabits = await ctx.db
      .query('habits')
      .filter((q) =>
        q.and(
          q.eq(q.field('archived'), true),
          q.eq(q.field('userId'), identity.subject)
        )
      )
      .collect();

    if (archivedHabits.length === 0) {
      // SEC-001: avoid cross-user deletion and no-op ambiguity
      const anyArchived = await ctx.db
        .query('habits')
        .filter((q) => q.eq(q.field('archived'), true))
        .collect();

      if (anyArchived.length === 0) {
        throw new Error('No archived habits exist in the system');
      }
      throw new Error('No archived habits found for authenticated user');
    }

    let deletedCount = 0;
    for (const habit of archivedHabits) {
      if (habit.userId !== identity.subject) {
        throw new Error('Not authorized to delete archived habits for another user');
      }

      // Delete all tracking data for this habit
      const trackingRecords = await ctx.db
        .query('tracking')
        .withIndex('by_habit_and_date', (q) => q.eq('habitId', habit._id))
        .collect();

      for (const record of trackingRecords) {
        await ctx.db.delete(record._id);
      }

      // Delete the habit
      await ctx.db.delete(habit._id);
      deletedCount++;
    }

    return { deletedCount };
  },
  returns: v.object({ deletedCount: v.number() }),
});
