/**
 * Reflections API - Quick Reflection feature for post-habit celebration
 *
 * Scientific basis:
 * - BJ Fogg (Stanford, "Tiny Habits"): Celebration wires habits
 * - Journaling increases self-awareness and consistency
 * - Daylio validation: 50M+ downloads, reflection = 60% higher retention
 */
import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// Emoji type for reflection rating
export const EMOJI_VALUES = ['frustrated', 'neutral', 'happy', 'fire'] as const;
export type EmojiType = (typeof EMOJI_VALUES)[number];

// Maximum note length
const MAX_NOTE_LENGTH = 500;

/**
 * Get reflection for a specific habit and date
 */
export const getByHabitAndDate = query({
  args: {
    habitId: v.id('habits'),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const reflection = await ctx.db
      .query('reflections')
      .withIndex('by_habit_and_date', (q) =>
        q.eq('habitId', args.habitId).eq('date', args.date)
      )
      .first();
    return reflection;
  },
});

/**
 * Get all reflections for a habit (for history/analytics)
 */
export const listByHabit = query({
  args: {
    habitId: v.id('habits'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 30;
    const reflections = await ctx.db
      .query('reflections')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .order('desc')
      .take(limit);
    return reflections;
  },
});

/**
 * Create or update a reflection for today (upsert pattern)
 * Only one reflection per habit per day is allowed
 */
export const upsert = mutation({
  args: {
    habitId: v.id('habits'),
    date: v.string(),
    emoji: v.union(
      v.literal('frustrated'),
      v.literal('neutral'),
      v.literal('happy'),
      v.literal('fire')
    ),
    note: v.optional(v.string()),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Validate note length
    if (args.note && args.note.length > MAX_NOTE_LENGTH) {
      throw new Error(`Note must be ${MAX_NOTE_LENGTH} characters or less`);
    }

    // Check if reflection already exists for this habit and date
    const existing = await ctx.db
      .query('reflections')
      .withIndex('by_habit_and_date', (q) =>
        q.eq('habitId', args.habitId).eq('date', args.date)
      )
      .first();

    if (existing) {
      // Update existing reflection
      await ctx.db.patch(existing._id, {
        emoji: args.emoji,
        note: args.note,
        updatedAt: now,
      });
      return existing._id;
    } else {
      // Create new reflection
      const id = await ctx.db.insert('reflections', {
        habitId: args.habitId,
        date: args.date,
        emoji: args.emoji,
        note: args.note,
        userId: args.userId,
        createdAt: now,
        updatedAt: now,
      });
      return id;
    }
  },
});

/**
 * Delete a reflection
 */
export const remove = mutation({
  args: {
    id: v.id('reflections'),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

/**
 * Get reflection statistics for a habit
 */
export const getStats = query({
  args: {
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    const reflections = await ctx.db
      .query('reflections')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .collect();

    const total = reflections.length;
    if (total === 0) {
      return {
        total: 0,
        emojiCounts: { frustrated: 0, neutral: 0, happy: 0, fire: 0 },
        positiveRate: 0,
        notesCount: 0,
      };
    }

    const emojiCounts = {
      frustrated: 0,
      neutral: 0,
      happy: 0,
      fire: 0,
    };

    let notesCount = 0;

    for (const r of reflections) {
      emojiCounts[r.emoji]++;
      if (r.note) notesCount++;
    }

    // Positive rate = (happy + fire) / total
    const positiveRate = ((emojiCounts.happy + emojiCounts.fire) / total) * 100;

    return {
      total,
      emojiCounts,
      positiveRate: Math.round(positiveRate),
      notesCount,
    };
  },
});
