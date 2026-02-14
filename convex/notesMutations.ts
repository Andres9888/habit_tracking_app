import { v } from 'convex/values';
import { mutation } from './_generated/server';
import { DATE_FORMAT_REGEX, MAX_NOTE_BODY_LENGTH } from './notes/types';
import {
  validateLongText,
  requireValid,
  containsDangerousPatterns,
} from './lib/inputValidation';

/**
 * Notes mutations - create, update, remove
 */

export const create = mutation({
  args: {
    body: v.string(),
    date: v.string(),
    habitId: v.optional(v.id('habits')),
  },
  handler: async (ctx, args) => {
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to create notes');
    }

    // SEC-001: If habitId provided, verify ownership of the habit
    if (args.habitId) {
      const habit = await ctx.db.get(args.habitId);
      if (!habit) {
        throw new Error('Habit not found');
      }
      if (habit.userId !== identity.subject) {
        throw new Error('Not authorized to add notes to this habit');
      }
    }

    // SEC-003: Input validation - body
    const bodyResult = validateLongText(args.body, MAX_NOTE_BODY_LENGTH, 'Note body');
    const body = requireValid(bodyResult, args.body);
    if (!body || body.trim() === '') {
      throw new Error('Note body cannot be empty');
    }

    // Validate date format as YYYY-MM-DD
    const isValidDate = DATE_FORMAT_REGEX.test(args.date);
    if (!isValidDate) {
      throw new Error('Invalid date format; expected YYYY-MM-DD');
    }

    const now = Date.now();
    return await ctx.db.insert('notes', {
      body: body.trim(),
      createdAt: now,
      date: args.date,
      habitId: args.habitId,
      updatedAt: now,
      userId: identity.subject,
    });
  },
  returns: v.id('notes'),
});

export const update = mutation({
  args: {
    body: v.string(),
    noteId: v.id('notes'),
  },
  handler: async (ctx, args) => {
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to update notes');
    }

    // SEC-003: Input validation - body
    const bodyResult = validateLongText(args.body, MAX_NOTE_BODY_LENGTH, 'Note body');
    const body = requireValid(bodyResult, args.body);
    if (!body || body.trim() === '') {
      throw new Error('Note body cannot be empty');
    }

    const note = await ctx.db.get(args.noteId);
    if (!note) {
      throw new Error('Note not found');
    }

    // SEC-001: Ownership verification via note's userId or parent habit
    if (note.userId && note.userId !== identity.subject) {
      throw new Error('Not authorized to update this note');
    }
    if (note.habitId) {
      const habit = await ctx.db.get(note.habitId);
      if (habit && habit.userId !== identity.subject) {
        throw new Error('Not authorized to update this note');
      }
    }

    await ctx.db.patch(args.noteId, {
      body: body.trim(),
      updatedAt: Date.now(),
    });

    return null;
  },
  returns: v.null(),
});

export const remove = mutation({
  args: {
    noteId: v.id('notes'),
  },
  handler: async (ctx, args) => {
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to delete notes');
    }

    const note = await ctx.db.get(args.noteId);
    if (!note) {
      throw new Error('Note not found');
    }

    // SEC-001: Ownership verification via note's userId or parent habit
    if (note.userId && note.userId !== identity.subject) {
      throw new Error('Not authorized to delete this note');
    }
    if (note.habitId) {
      const habit = await ctx.db.get(note.habitId);
      if (habit && habit.userId !== identity.subject) {
        throw new Error('Not authorized to delete this note');
      }
    }

    await ctx.db.delete(args.noteId);
    return null;
  },
  returns: v.null(),
});
