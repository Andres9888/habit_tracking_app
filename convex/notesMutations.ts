import { v } from 'convex/values';
import { mutation } from './_generated/server';
import { DATE_FORMAT_REGEX, MAX_NOTE_BODY_LENGTH } from './notes';

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
    // Validate body length (max 1000 chars as per AC4)
    if (args.body.length > MAX_NOTE_BODY_LENGTH) {
      throw new Error(
        `Note body cannot exceed ${MAX_NOTE_BODY_LENGTH} characters`
      );
    }

    // Validate date format as YYYY-MM-DD
    const isValidDate = DATE_FORMAT_REGEX.test(args.date);
    if (!isValidDate) {
      throw new Error('Invalid date format; expected YYYY-MM-DD');
    }

    const now = Date.now();
    return await ctx.db.insert('notes', {
      body: args.body,
      createdAt: now,
      date: args.date,
      habitId: args.habitId,
      updatedAt: now,
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
    // Validate body length (max 1000 chars as per AC4)
    if (args.body.length > MAX_NOTE_BODY_LENGTH) {
      throw new Error(
        `Note body cannot exceed ${MAX_NOTE_BODY_LENGTH} characters`
      );
    }

    const note = await ctx.db.get(args.noteId);
    if (!note) {
      throw new Error('Note not found');
    }

    await ctx.db.patch(args.noteId, {
      body: args.body,
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
    const note = await ctx.db.get(args.noteId);
    if (!note) {
      throw new Error('Note not found');
    }

    await ctx.db.delete(args.noteId);
    return null;
  },
  returns: v.null(),
});
