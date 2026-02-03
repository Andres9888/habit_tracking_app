import { v } from 'convex/values';
import { query } from './_generated/server';
import { notesArrayValidator, nullableNoteValidator } from './notes';

/**
 * Notes queries - list, search, get
 */

export const list = query({
  args: {},
  handler: async (ctx) => {
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to view notes');
    }

    // SEC-001: Filter notes by authenticated user
    return await ctx.db
      .query('notes')
      .filter((q) => q.eq(q.field('userId'), identity.subject))
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
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to search notes');
    }

    // SEC-001: Filter notes by authenticated user
    let notes = await ctx.db
      .query('notes')
      .filter((q) => q.eq(q.field('userId'), identity.subject))
      .order('desc')
      .collect();

    if (args.habitId) {
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
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to view notes');
    }

    const note = await ctx.db.get(args.noteId);
    if (!note) return null;

    // SEC-001: Ownership verification via note's userId or parent habit
    if (note.userId && note.userId !== identity.subject) {
      throw new Error('Not authorized to view this note');
    }
    if (note.habitId) {
      const habit = await ctx.db.get(note.habitId);
      if (habit && habit.userId !== identity.subject) {
        throw new Error('Not authorized to view this note');
      }
    }

    return note;
  },
  returns: nullableNoteValidator,
});
