import { v } from 'convex/values';
import { mutation } from './_generated/server';
import {
  DATE_FORMAT_REGEX,
  emojiValidator,
  MAX_REFLECTION_NOTE_LENGTH,
} from './reflections';
import {
  validateLongText,
  validateEmoji,
  requireValid,
} from './lib/inputValidation';

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
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to create reflections');
    }

    // Validate date format as YYYY-MM-DD
    if (!DATE_FORMAT_REGEX.test(args.date)) {
      throw new Error('Invalid date format; expected YYYY-MM-DD');
    }

    // SEC-003: Input validation - emoji
    const emojiResult = validateEmoji(args.emoji, 'Emoji');
    const emoji = requireValid(emojiResult, args.emoji);

    // SEC-003: Input validation - note
    const noteResult = validateLongText(args.note, MAX_REFLECTION_NOTE_LENGTH, 'Reflection note');
    const note = requireValid(noteResult, args.note);

    // Check if habit exists
    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }

    // SEC-001: Ownership verification - verify user owns the habit
    if (habit.userId !== identity.subject) {
      throw new Error('Not authorized to add reflections to this habit');
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
        emoji,
        note,
        updatedAt: now,
      });
      return existingReflection._id;
    }

    return await ctx.db.insert('reflections', {
      createdAt: now,
      date: args.date,
      emoji,
      habitId: args.habitId,
      note,
      updatedAt: now,
      userId: identity.subject,
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
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to delete reflections');
    }

    const reflection = await ctx.db.get(args.reflectionId);
    if (!reflection) {
      throw new Error('Reflection not found');
    }

    // SEC-001: Ownership verification via reflection's userId or parent habit
    if (reflection.userId && reflection.userId !== identity.subject) {
      throw new Error('Not authorized to delete this reflection');
    }
    const habit = await ctx.db.get(reflection.habitId);
    if (habit && habit.userId !== identity.subject) {
      throw new Error('Not authorized to delete this reflection');
    }

    await ctx.db.delete(args.reflectionId);
    return null;
  },
  returns: v.null(),
});
