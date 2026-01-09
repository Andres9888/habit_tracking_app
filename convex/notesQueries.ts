import { v } from 'convex/values';
import { query } from './_generated/server';
import { notesArrayValidator, nullableNoteValidator } from './notes';

/**
 * Notes queries - list, search, get
 */

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('notes').order('desc').collect();
  },
  returns: notesArrayValidator,
});

export const search = query({
  args: {
    habitId: v.optional(v.id('habits')),
    searchText: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let notes = await ctx.db.query('notes').order('desc').collect();

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
    return await ctx.db.get(args.noteId);
  },
  returns: nullableNoteValidator,
});
