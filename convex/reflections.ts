/**
 * Reflections API
 * Quick Reflection - Post-habit completion feedback (BJ Fogg's Tiny Habits)
 *
 * Scientific Basis:
 * - BJ Fogg (Stanford, "Tiny Habits"): Celebration wires habits
 * - Journaling increases self-awareness and consistency
 * - Daylio (50M+ downloads) validates the reflection pattern
 *
 * Story T6: Quick Reflection
 */

import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { Id } from './_generated/dataModel';
import {
  requireAuthenticatedUser,
  requireOwnedDocumentById,
  requireOwnedHabit,
} from './security';

// Emoji type validator - matches schema definition
const emojiValidator = v.union(
  v.literal('frustrated'),
  v.literal('neutral'),
  v.literal('happy'),
  v.literal('fire')
);

// Reflection object validator for return types
const reflectionObjectValidator = v.object({
  _creationTime: v.number(),
  _id: v.id('reflections'),
  habitId: v.id('habits'),
  userId: v.optional(v.string()),
  date: v.string(),
  emoji: emojiValidator,
  note: v.optional(v.string()),
  createdAt: v.number(),
  updatedAt: v.number(),
});

/**
 * Get a reflection for a specific habit and date
 */
export const getByHabitAndDate = query({
  args: {
    habitId: v.id('habits'),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuthenticatedUser(ctx);
    await requireOwnedHabit(ctx, args.habitId, userId);

    return await ctx.db
      .query('reflections')
      .withIndex('by_habit_and_date', (q) =>
        q.eq('habitId', args.habitId).eq('date', args.date)
      )
      .first();
  },
  returns: v.union(v.null(), reflectionObjectValidator),
});

/**
 * Get all reflections for a specific habit
 */
export const listByHabit = query({
  args: {
    habitId: v.id('habits'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuthenticatedUser(ctx);
    await requireOwnedHabit(ctx, args.habitId, userId);

    let query = ctx.db
      .query('reflections')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .order('desc');

    if (args.limit) {
      return await query.take(args.limit);
    }

    return await query.collect();
  },
  returns: v.array(reflectionObjectValidator),
});

/**
 * Create or update a reflection for a habit on a specific date
 * Only one reflection per habit per day is allowed
 */
export const upsert = mutation({
  args: {
    habitId: v.id('habits'),
    date: v.string(),
    emoji: emojiValidator,
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuthenticatedUser(ctx);
    await requireOwnedHabit(ctx, args.habitId, userId);

    // Validate date format as YYYY-MM-DD
    const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(args.date);
    if (!isValidDate) {
      throw new Error('Invalid date format; expected YYYY-MM-DD');
    }

    // Validate note length (max 500 chars)
    if (args.note && args.note.length > 500) {
      throw new Error('Reflection note cannot exceed 500 characters');
    }

    // Check if habit exists
    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }

    const now = Date.now();

    // Check for existing reflection
    const existingReflection = await ctx.db
      .query('reflections')
      .withIndex('by_habit_and_date', (q) =>
        q.eq('habitId', args.habitId).eq('date', args.date)
      )
      .first();

    if (existingReflection) {
      // Update existing reflection
      await ctx.db.patch(existingReflection._id, {
        emoji: args.emoji,
        note: args.note,
        updatedAt: now,
      });
      return existingReflection._id;
    }

    // Create new reflection
    return await ctx.db.insert('reflections', {
      habitId: args.habitId,
      date: args.date,
      emoji: args.emoji,
      note: args.note,
      createdAt: now,
      updatedAt: now,
      userId,
    });
  },
  returns: v.id('reflections'),
});

/**
 * Delete a reflection
 */
export const remove = mutation({
  args: {
    reflectionId: v.id('reflections'),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuthenticatedUser(ctx);
    await requireOwnedDocumentById(
      async (id) => await ctx.db.get(id as Id<'reflections'>),
      args.reflectionId,
      userId,
      'reflection'
    );

    await ctx.db.delete(args.reflectionId);
    return null;
  },
  returns: v.null(),
});

/**
 * Get recent reflections across all habits (for analytics/insights)
 */
export const listRecent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuthenticatedUser(ctx);
    const limit = args.limit ?? 10;

    return await ctx.db
      .query('reflections')
      .filter((q) => q.eq(q.field('userId'), userId))
      .order('desc')
      .take(limit);
  },

  returns: v.array(reflectionObjectValidator),
});
