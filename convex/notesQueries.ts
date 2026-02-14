import { v } from 'convex/values';
import { query } from './_generated/server';
import { notesArrayValidator, nullableNoteValidator } from './notes/types';

/**
 * Notes queries - list, search, get
 * SEC-001: All queries require authentication and user filtering to prevent data leaks
 */

export const list = query({
  args: {},
  handler: async (ctx) => {
    // SEC-001: Authentication check - require user to be logged in
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    // SEC-001: Filter notes to only authenticated user's notes
    return await ctx.db
      .query('notes')
      .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
      .order('desc')
      .collect();
  },
  returns: notesArrayValidator,
});

export const search = query({
  args: {
    habitId: v.optional(v.id('habits')),
    searchText: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // SEC-001: Authentication check - require user to be logged in
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    // SEC-001: Start with authenticated user's notes only
    let notes = await ctx.db
      .query('notes')
      .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
      .collect();

    // SEC-001: If habitId provided, verify ownership of the habit
    if (args.habitId) {
      const habit = await ctx.db.get(args.habitId);
      if (!habit || habit.userId !== identity.subject) {
        return [];
      }
      notes = notes.filter((note) => note.habitId === args.habitId);
    }

    if (args.searchText && args.searchText.trim()) {
      const searchLower = args.searchText.toLowerCase();
      notes = notes.filter((note) =>
        note.body.toLowerCase().includes(searchLower)
      );
    }

    return notes;
  },
  returns: notesArrayValidator,
});

export const get = query({
  args: {
    noteId: v.id('notes'),
  },
  handler: async (ctx, args) => {
    // SEC-001: Authentication check - require user to be logged in
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const note = await ctx.db.get(args.noteId);
    if (!note) {
      return null;
    }

    // SEC-001: Ownership verification - only return if user owns this note
    if (note.userId !== identity.subject) {
      throw new Error('Not authorized to access this note');
    }

    return note;
  },
  returns: nullableNoteValidator,
});
