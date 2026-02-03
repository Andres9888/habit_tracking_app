import { v } from 'convex/values';
import { query } from './_generated/server';
import {
  nullableReflectionValidator,
  reflectionsArrayValidator,
} from './reflections';

/**
 * Reflections queries
 */

/** Get a reflection for a specific habit and date */
export const getByHabitAndDate = query({
  args: {
    date: v.string(),
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to view reflections');
    }

    // SEC-001: Verify habit ownership
    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }
    if (habit.userId !== identity.subject) {
      throw new Error('Not authorized to view reflections for this habit');
    }

    return await ctx.db
      .query('reflections')
      .withIndex('by_habit_and_date', (q) =>
        q.eq('habitId', args.habitId).eq('date', args.date)
      )
      .first();
  },
  returns: nullableReflectionValidator,
});

/** Get all reflections for a specific habit */
export const listByHabit = query({
  args: {
    habitId: v.id('habits'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to view reflections');
    }

    // SEC-001: Verify habit ownership
    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }
    if (habit.userId !== identity.subject) {
      throw new Error('Not authorized to view reflections for this habit');
    }

    const query = ctx.db
      .query('reflections')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .order('desc');

    if (args.limit) {
      return await query.take(args.limit);
    }

    return await query.collect();
  },
  returns: reflectionsArrayValidator,
});

/** Get recent reflections across all habits (for analytics/insights) */
export const listRecent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to view reflections');
    }

    const limit = args.limit ?? 10;

    // SEC-001: Get all reflections and filter by user's habits
    const allReflections = await ctx.db.query('reflections').order('desc').collect();
    const userReflections = [];

    for (const reflection of allReflections) {
      const habit = await ctx.db.get(reflection.habitId);
      if (habit && habit.userId === identity.subject) {
        userReflections.push(reflection);
        if (userReflections.length >= limit) break;
      }
    }

    return userReflections;
  },
  returns: reflectionsArrayValidator,
});
