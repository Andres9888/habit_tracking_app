import { v } from 'convex/values';
import { query } from './_generated/server';
import {
  nullableReflectionValidator,
  reflectionsArrayValidator,
} from './reflections';

/**
 * Reflections queries
 * SEC-001: All queries require authentication and filter by userId
 */

/** Get a reflection for a specific habit and date */
export const getByHabitAndDate = query({
  args: {
    date: v.string(),
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const reflection = await ctx.db
      .query('reflections')
      .withIndex('by_habit_and_date', (q) =>
        q.eq('habitId', args.habitId).eq('date', args.date)
      )
      .first();

    if (!reflection) return null;
    if (reflection.userId !== identity.subject) return null;

    return reflection;
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const q = ctx.db
      .query('reflections')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .filter((q) => q.eq(q.field('userId'), identity.subject))
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const limit = args.limit ?? 10;
    return await ctx.db
      .query('reflections')
      .filter((q) => q.eq(q.field('userId'), identity.subject))
      .order('desc')
      .take(limit);
  },
  returns: reflectionsArrayValidator,
});
