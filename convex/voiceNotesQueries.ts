/**
 * Voice Notes Query API
 */

import { v } from 'convex/values';
import { query } from './_generated/server';
import { voiceNoteObjectValidator } from './voiceNotes/index';

/**
 * Get all voice notes for a specific habit
 */
export const listByHabit = query({
  args: { habitId: v.id('habits'), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const q = ctx.db
      .query('voiceNotes')
      .withIndex('by_habit', (query) => query.eq('habitId', args.habitId))
      .order('desc');
    return args.limit ? await q.take(args.limit) : await q.collect();
  },
  returns: v.array(voiceNoteObjectValidator),
});

/**
 * Get the Day 1 voice note for a habit (featured in Rescue Mode)
 */
export const getDay1Note = query({
  args: { habitId: v.id('habits') },
  handler: async (ctx, args) => {
    const notes = await ctx.db
      .query('voiceNotes')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .collect();

    const markedDay1 = notes.find((note) => note.isDay1);
    if (markedDay1) return markedDay1;

    if (notes.length > 0) {
      let oldest = notes[0];
      for (const note of notes) {
        if (note.createdAt < oldest.createdAt) oldest = note;
      }
      return oldest;
    }
    return null;
  },
  returns: v.union(v.null(), voiceNoteObjectValidator),
});

/**
 * Get a single voice note by ID
 */
export const get = query({
  args: { voiceNoteId: v.id('voiceNotes') },
  handler: async (ctx, args) => await ctx.db.get(args.voiceNoteId),
  returns: v.union(v.null(), voiceNoteObjectValidator),
});

/**
 * Count voice notes for a habit (for premium gating)
 */
export const countByHabit = query({
  args: { habitId: v.id('habits') },
  handler: async (ctx, args) => {
    const notes = await ctx.db
      .query('voiceNotes')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .collect();
    return notes.length;
  },
  returns: v.number(),
});

/**
 * Get recent voice notes across all habits
 */
export const listRecent = query({
  args: { limit: v.optional(v.number()), userId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    if (args.userId) {
      return await ctx.db
        .query('voiceNotes')
        .withIndex('by_user', (q) => q.eq('userId', args.userId))
        .order('desc')
        .take(limit);
    }
    return await ctx.db.query('voiceNotes').order('desc').take(limit);
  },
  returns: v.array(voiceNoteObjectValidator),
});

// Complex streak query is in ./voiceNotesStreakQuery.ts
export { getFromBestStreak } from './voiceNotesStreakQuery';
