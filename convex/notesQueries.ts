import { v } from 'convex/values';
import { query } from './_generated/server';
import { notesArrayValidator, nullableNoteValidator } from './notes/types';

/**
 * Notes queries - list, search, get
 *
 * PERF FIX: Filter by userId for security and performance
 */

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    return await ctx.db
      .query('notes')
      .withIndex('by_user_and_date', (q) => q.eq('userId', identity.subject))
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    let notes = await ctx.db
      .query('notes')
      .withIndex('by_user_and_date', (q) => q.eq('userId', identity.subject))
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
    return await ctx.db.get(args.noteId);
  },
  returns: nullableNoteValidator,
});
