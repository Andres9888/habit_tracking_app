import { v } from 'convex/values';
import { query } from './_generated/server';
import {
  nullableReflectionValidator,
  reflectionsArrayValidator,
} from './reflections/types';

/**
 * Reflections queries
 * SEC-001: All queries require authentication and ownership verification
 */

/** Get a reflection for a specific habit and date */
export const getByHabitAndDate = query({
  args: {
    date: v.string(),
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    // SEC-001: Authentication check - require user to be logged in
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    // SEC-001: Ownership verification via habit
    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      return null;
    }
    if (habit.userId !== identity.subject) {
      throw new Error('Not authorized to access reflections for this habit');
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
    // SEC-001: Authentication check - require user to be logged in
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    // SEC-001: Ownership verification via habit
    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      return [];
    }
    if (habit.userId !== identity.subject) {
      throw new Error('Not authorized to access reflections for this habit');
    }

    const q = ctx.db
      .query('reflections')
      .withIndex('by_habit', (query) => query.eq('habitId', args.habitId))
      .order('desc');

    if (args.limit) {
      return await q.take(args.limit);
    }

    return await q.collect();
  },
  returns: reflectionsArrayValidator,
});

/** Get recent reflections across all habits (for analytics/insights) */
export const listRecent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // SEC-001: Authentication check - require user to be logged in
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    // SEC-001: Only return reflections for authenticated user's habits
    const limit = args.limit ?? 10;
    const userHabits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
      .collect();

    const habitIds = new Set(userHabits.map((h) => h._id));

    const allReflections = await ctx.db
      .query('reflections')
      .order('desc')
      .take(limit * 3); // Get more to account for filtering

    return allReflections
      .filter((r) => habitIds.has(r.habitId))
      .slice(0, limit);
  },
  returns: reflectionsArrayValidator,
});
