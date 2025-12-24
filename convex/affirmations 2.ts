/**
 * Affirmations API
 *
 * Positive self-talk cards tied to specific habits.
 * Based on:
 * - Self-affirmation theory (Steele, 1988)
 * - Sports psychology self-talk research (Hatzigeorgiadis et al., 2011)
 *
 * Three types:
 * - identity: "I am someone who..." (most powerful)
 * - motivational: "I can do hard things"
 * - instructional: "Progress, not perfection"
 */

import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

const MAX_AFFIRMATIONS_PER_HABIT = 10;
const MAX_TEXT_LENGTH = 200;

/**
 * List all affirmations for a specific habit
 */
export const listByHabit = query({
  args: {
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    const affirmations = await ctx.db
      .query('affirmations')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .collect();

    // Sort by creation date (newest first)
    return affirmations.sort((a, b) => b.createdAt - a.createdAt);
  },
  returns: v.array(
    v.object({
      _creationTime: v.number(),
      _id: v.id('affirmations'),
      createdAt: v.number(),
      habitId: v.id('habits'),
      text: v.string(),
      type: v.optional(
        v.union(
          v.literal('identity'),
          v.literal('motivational'),
          v.literal('instructional')
        )
      ),
      updatedAt: v.number(),
      userId: v.optional(v.string()),
    })
  ),
});

/**
 * Create a new affirmation for a habit
 */
export const create = mutation({
  args: {
    habitId: v.id('habits'),
    text: v.string(),
    type: v.optional(
      v.union(
        v.literal('identity'),
        v.literal('motivational'),
        v.literal('instructional')
      )
    ),
  },
  handler: async (ctx, args) => {
    const text = args.text.trim();

    // Validation
    if (!text) {
      throw new Error('Affirmation text is required');
    }
    if (text.length > MAX_TEXT_LENGTH) {
      throw new Error(`Affirmation cannot exceed ${MAX_TEXT_LENGTH} characters`);
    }

    // Check habit exists
    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }

    // Check limit per habit
    const existing = await ctx.db
      .query('affirmations')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .collect();

    if (existing.length >= MAX_AFFIRMATIONS_PER_HABIT) {
      throw new Error(
        `Maximum ${MAX_AFFIRMATIONS_PER_HABIT} affirmations per habit. Remove one to add another.`
      );
    }

    const now = Date.now();
    return await ctx.db.insert('affirmations', {
      createdAt: now,
      habitId: args.habitId,
      text,
      type: args.type,
      updatedAt: now,
    });
  },
  returns: v.id('affirmations'),
});

/**
 * Update an existing affirmation
 */
export const update = mutation({
  args: {
    id: v.id('affirmations'),
    text: v.optional(v.string()),
    type: v.optional(
      v.union(
        v.literal('identity'),
        v.literal('motivational'),
        v.literal('instructional')
      )
    ),
  },
  handler: async (ctx, args) => {
    const affirmation = await ctx.db.get(args.id);
    if (!affirmation) {
      throw new Error('Affirmation not found');
    }

    const updates: {
      text?: string;
      type?: 'identity' | 'motivational' | 'instructional';
      updatedAt: number;
    } = {
      updatedAt: Date.now(),
    };

    if (args.text !== undefined) {
      const text = args.text.trim();
      if (!text) {
        throw new Error('Affirmation text is required');
      }
      if (text.length > MAX_TEXT_LENGTH) {
        throw new Error(`Affirmation cannot exceed ${MAX_TEXT_LENGTH} characters`);
      }
      updates.text = text;
    }

    if (args.type !== undefined) {
      updates.type = args.type;
    }

    await ctx.db.patch(args.id, updates);
    return null;
  },
  returns: v.null(),
});

/**
 * Delete an affirmation
 */
export const remove = mutation({
  args: {
    id: v.id('affirmations'),
  },
  handler: async (ctx, args) => {
    const affirmation = await ctx.db.get(args.id);
    if (!affirmation) {
      throw new Error('Affirmation not found');
    }

    await ctx.db.delete(args.id);
    return null;
  },
  returns: v.null(),
});
