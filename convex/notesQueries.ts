import { v } from 'convex/values';
import { query } from './_generated/server';
import { notesArrayValidator, nullableNoteValidator } from './notes/types';

/**
 * Notes queries - list, search, get
 */

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    // PERF FIX: Use by_user_and_date index instead of full table scan
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
    if (!identity) return [];

    let notes;
    if (args.habitId) {
      // PERF FIX: Use by_habit index for direct habit lookups
      notes = await ctx.db
        .query('notes')
        .withIndex('by_habit', (q) => q.eq('habitId', args.habitId!))
        .order('desc')
        .collect();
      // Filter to user's notes only
      notes = notes.filter((n) => n.userId === identity.subject);
    } else {
      // PERF FIX: Use by_user_and_date index instead of full table scan
      notes = await ctx.db
        .query('notes')
        .withIndex('by_user_and_date', (q) => q.eq('userId', identity.subject))
        .order('desc')
        .collect();
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
