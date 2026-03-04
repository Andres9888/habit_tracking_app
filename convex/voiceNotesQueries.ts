/**
 * Voice Notes Query API
 *
 * SEC-004: All queries require authentication and verify ownership
 * to prevent unauthorized access to voice note URLs
 */

import { v } from 'convex/values';
import { query } from './_generated/server';
import { voiceNoteObjectValidator } from './voiceNotes/index';

/**
 * Get all voice notes for a specific habit
 * SEC-004: Requires authentication and habit ownership verification
 */
export const listByHabit = query({
  args: { habitId: v.id('habits'), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    // SEC-004: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to view voice notes');
    }

    // SEC-004: Ownership verification via habit
    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }
    if (!habit || habit.userId !== identity.subject) {
      throw new Error('Not authorized to view voice notes for this habit');
    }

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
 * SEC-004: Requires authentication and habit ownership verification
 */
export const getDay1Note = query({
  args: { habitId: v.id('habits') },
  handler: async (ctx, args) => {
    // SEC-004: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to view voice notes');
    }

    // SEC-004: Ownership verification via habit
    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }
    if (!habit || habit.userId !== identity.subject) {
      throw new Error('Not authorized to view voice notes for this habit');
    }

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
 * SEC-004: Requires authentication and ownership verification
 */
export const get = query({
  args: { voiceNoteId: v.id('voiceNotes') },
  handler: async (ctx, args) => {
    // SEC-004: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to view voice notes');
    }

    const voiceNote = await ctx.db.get(args.voiceNoteId);
    if (!voiceNote) return null;

    // SEC-004: Ownership verification
    if (voiceNote.userId !== identity.subject) {
      throw new Error('Not authorized to view this voice note');
    }

    return voiceNote;
  },
  returns: v.union(v.null(), voiceNoteObjectValidator),
});

/**
 * Count voice notes for a habit (for premium gating)
 * SEC-004: Requires authentication and habit ownership verification
 */
export const countByHabit = query({
  args: { habitId: v.id('habits') },
  handler: async (ctx, args) => {
    // SEC-004: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to view voice notes');
    }

    // SEC-004: Ownership verification via habit
    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }
    if (!habit || habit.userId !== identity.subject) {
      throw new Error('Not authorized to view voice notes for this habit');
    }

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
 * SEC-006: Added authentication and user filtering to prevent cross-user data exposure
 */
export const listRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    // SEC-006: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error(
        'Unauthenticated: Must be logged in to view recent voice notes'
      );
    }

    const limit = args.limit ?? 10;

    // SEC-006: Always filter by authenticated user's ID to prevent cross-user data exposure
    return await ctx.db
      .query('voiceNotes')
      .withIndex('by_user', (q) => q.eq('userId', identity.subject))
      .order('desc')
      .take(limit);
  },
  returns: v.array(voiceNoteObjectValidator),
});

// Complex streak query is in ./voiceNotesStreakQuery.ts
export { getFromBestStreak } from './voiceNotesStreakQuery';
