import { v } from 'convex/values';
import { mutation } from './_generated/server';
import {
  DATE_FORMAT_REGEX,
  emojiValidator,
  MAX_REFLECTION_NOTE_LENGTH,
} from './reflections';

/**
 * Reflections mutations
 */

/** Create or update a reflection for a habit on a specific date */
export const upsert = mutation({
  args: {
    date: v.string(),
    emoji: emojiValidator,
    habitId: v.id('habits'),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Validate date format as YYYY-MM-DD
    if (!DATE_FORMAT_REGEX.test(args.date)) {
      throw new Error('Invalid date format; expected YYYY-MM-DD');
    }

    // Validate note length
    if (args.note && args.note.length > MAX_REFLECTION_NOTE_LENGTH) {
      throw new Error(
        `Reflection note cannot exceed ${MAX_REFLECTION_NOTE_LENGTH} characters`
      );
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
      await ctx.db.patch(existingReflection._id, {
        emoji: args.emoji,
        note: args.note,
        updatedAt: now,
      });
      return existingReflection._id;
    }

    return await ctx.db.insert('reflections', {
      createdAt: now,
      date: args.date,
      emoji: args.emoji,
      habitId: args.habitId,
      note: args.note,
      updatedAt: now,
    });
  },
  returns: v.id('reflections'),
});

/** Delete a reflection */
export const remove = mutation({
  args: {
    reflectionId: v.id('reflections'),
  },
  handler: async (ctx, args) => {
    const reflection = await ctx.db.get(args.reflectionId);
    if (!reflection) {
      throw new Error('Reflection not found');
    }

    await ctx.db.delete(args.reflectionId);
    return null;
  },
  returns: v.null(),
});
