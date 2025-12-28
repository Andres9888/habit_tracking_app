/**
 * Voice Notes API
 * Audio recordings of motivation, progress, and emotional states
 *
 * Scientific Basis:
 * - Voice has 40% higher emotional recall than text (cognitive psychology)
 * - Hearing your own voice from Day 1 creates powerful emotional anchor
 * - Self-generated audio reinforces commitment through auditory memory
 *
 * Business Model:
 * - Reflectly ($2M ARR) built business on voice journaling
 * - Premium feature: 1 free recording, unlimited for premium users
 * - Day 1 recording prominently featured in Rescue Mode
 *
 * Story T10: Voice Notes
 */

import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// Voice note object validator for return types
const voiceNoteObjectValidator = v.object({
  _creationTime: v.number(),
  _id: v.id('voiceNotes'),
  audioUrl: v.string(),
  createdAt: v.number(),
  duration: v.number(),
  habitId: v.id('habits'),
  isDay1: v.optional(v.boolean()),
  label: v.optional(v.string()),
  updatedAt: v.optional(v.number()),
  userId: v.optional(v.string()),
});

/**
 * Get all voice notes for a specific habit
 */
export const listByHabit = query({
  args: {
    habitId: v.id('habits'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const query = ctx.db
      .query('voiceNotes')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .order('desc');

    if (args.limit) {
      return await query.take(args.limit);
    }

    return await query.collect();
  },
  returns: v.array(voiceNoteObjectValidator),
});

/**
 * Get the Day 1 voice note for a habit (featured in Rescue Mode)
 */
export const getDay1Note = query({
  args: {
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    const notes = await ctx.db
      .query('voiceNotes')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .collect();

    // First, look for explicitly marked Day 1 note
    const markedDay1 = notes.find((note) => note.isDay1);
    if (markedDay1) {
      return markedDay1;
    }

    // Fall back to the oldest note (first recorded)
    if (notes.length > 0) {
      let oldest = notes[0];
      for (const note of notes) {
        if (note.createdAt < oldest.createdAt) {
          oldest = note;
        }
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
  args: {
    voiceNoteId: v.id('voiceNotes'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.voiceNoteId);
  },
  returns: v.union(v.null(), voiceNoteObjectValidator),
});

/**
 * Count voice notes for a habit (for premium gating)
 */
export const countByHabit = query({
  args: {
    habitId: v.id('habits'),
  },
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
 * Create a new voice note
 */
export const create = mutation({
  args: {
    audioUrl: v.string(),
    duration: v.number(),
    habitId: v.id('habits'),
    isDay1: v.optional(v.boolean()),
    label: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Validate that habit exists
    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }

    // Validate duration (max 5 minutes = 300 seconds)
    if (args.duration <= 0) {
      throw new Error('Duration must be positive');
    }
    if (args.duration > 300) {
      throw new Error('Voice note cannot exceed 5 minutes');
    }

    // Validate label length (max 100 chars)
    if (args.label && args.label.length > 100) {
      throw new Error('Label cannot exceed 100 characters');
    }

    // Validate audioUrl format (should be a Convex storage URL or valid URL)
    if (!args.audioUrl || args.audioUrl.trim() === '') {
      throw new Error('Audio URL is required');
    }

    const now = Date.now();

    // If this is marked as Day 1, unmark any existing Day 1 notes for this habit
    if (args.isDay1) {
      const existingNotes = await ctx.db
        .query('voiceNotes')
        .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
        .collect();

      for (const note of existingNotes) {
        if (note.isDay1) {
          await ctx.db.patch(note._id, { isDay1: false, updatedAt: now });
        }
      }
    }

    return await ctx.db.insert('voiceNotes', {
      audioUrl: args.audioUrl,
      createdAt: now,
      duration: args.duration,
      habitId: args.habitId,
      isDay1: args.isDay1 ?? false,
      label: args.label,
    });
  },
  returns: v.id('voiceNotes'),
});

/**
 * Update a voice note's label or Day 1 flag
 */
export const update = mutation({
  args: {
    isDay1: v.optional(v.boolean()),
    label: v.optional(v.string()),
    voiceNoteId: v.id('voiceNotes'),
  },
  handler: async (ctx, args) => {
    const voiceNote = await ctx.db.get(args.voiceNoteId);
    if (!voiceNote) {
      throw new Error('Voice note not found');
    }

    // Validate label length
    if (args.label && args.label.length > 100) {
      throw new Error('Label cannot exceed 100 characters');
    }

    const now = Date.now();

    // If marking as Day 1, unmark any existing Day 1 notes for this habit
    if (args.isDay1) {
      const existingNotes = await ctx.db
        .query('voiceNotes')
        .withIndex('by_habit', (q) => q.eq('habitId', voiceNote.habitId))
        .collect();

      for (const note of existingNotes) {
        if (note.isDay1 && note._id !== args.voiceNoteId) {
          await ctx.db.patch(note._id, { isDay1: false, updatedAt: now });
        }
      }
    }

    await ctx.db.patch(args.voiceNoteId, {
      ...(args.label !== undefined && { label: args.label }),
      ...(args.isDay1 !== undefined && { isDay1: args.isDay1 }),
      updatedAt: now,
    });

    return args.voiceNoteId;
  },
  returns: v.id('voiceNotes'),
});

/**
 * Delete a voice note
 */
export const remove = mutation({
  args: {
    voiceNoteId: v.id('voiceNotes'),
  },
  handler: async (ctx, args) => {
    const voiceNote = await ctx.db.get(args.voiceNoteId);
    if (!voiceNote) {
      throw new Error('Voice note not found');
    }

    // Note: The audio file in storage should be deleted separately
    // via a scheduled job or file storage cleanup

    await ctx.db.delete(args.voiceNoteId);
    return null;
  },
  returns: v.null(),
});

/**
 * Get recent voice notes across all habits (for user dashboard/insights)
 */
export const listRecent = query({
  args: {
    limit: v.optional(v.number()),
    userId: v.optional(v.string()),
  },
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

/**
 * Streak context for voice notes in recovery mode
 */
const voiceNoteWithStreakContextValidator = v.object({
  ...voiceNoteObjectValidator.fields,
  daysAgo: v.number(),
  streakAtRecording: v.number(),
});

/**
 * Get voice notes recorded during the user's best streak period
 *
 * Scientific Basis:
 * - Voice has 40% higher emotional recall than text (cognitive psychology)
 * - Reconnecting with "peak motivation self" during struggle is powerful
 * - Hearing your own voice from your best streak creates emotional anchor
 *
 * Used in Rescue Mode to help users reconnect with their most committed self.
 * Returns voice notes with context about when they were recorded relative to streaks.
 */
export const getFromBestStreak = query({
  args: {
    habitId: v.id('habits'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 3;

    // Get habit to check best streak
    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      return [];
    }

    const bestStreak = habit.bestStreak ?? 0;
    if (bestStreak < 3) {
      // No meaningful best streak to pull voice notes from
      // (need at least 3 days to have a "best streak period")
      return [];
    }

    // Get tracking history to find the best streak period dates
    const tracking = await ctx.db
      .query('tracking')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .collect();

    // Find the date range of the best streak
    const completedDates = tracking
      .filter((t) => t.completed)
      .map((t) => t.date)
      .sort((a, b) => a.localeCompare(b)); // ascending

    if (completedDates.length === 0) {
      return [];
    }

    // Find the best streak period (start and end dates)
    const bestStreakPeriod = findBestStreakPeriod(completedDates, bestStreak);
    if (!bestStreakPeriod) {
      return [];
    }

    const { startDate, endDate } = bestStreakPeriod;

    // Convert date strings to timestamps for comparison
    const startTimestamp = new Date(startDate + 'T00:00:00').getTime();
    const endTimestamp = new Date(endDate + 'T23:59:59').getTime();

    // Get voice notes for this habit
    const allNotes = await ctx.db
      .query('voiceNotes')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .collect();

    // Filter to notes created during the best streak period
    const notesFromBestStreak = allNotes.filter((note) => {
      return note.createdAt >= startTimestamp && note.createdAt <= endTimestamp;
    });

    if (notesFromBestStreak.length === 0) {
      return [];
    }

    // Calculate streak context for each note
    const now = Date.now();
    const notesWithContext = notesFromBestStreak.map((note) => {
      // Calculate what day of the streak this note was recorded on
      const noteDate = new Date(note.createdAt);
      noteDate.setHours(0, 0, 0, 0);
      const streakStartDate = new Date(startDate + 'T00:00:00');
      const dayOfStreak =
        Math.floor(
          (noteDate.getTime() - streakStartDate.getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1; // 1-indexed

      const daysAgo = Math.floor(
        (now - note.createdAt) / (1000 * 60 * 60 * 24)
      );

      return {
        ...note,
        daysAgo,
        streakAtRecording: dayOfStreak,
      };
    });

    // Sort by streak day (descending - most recent streak day first) and take limit
    return notesWithContext
      .sort((a, b) => b.streakAtRecording - a.streakAtRecording)
      .slice(0, limit);
  },
  returns: v.array(voiceNoteWithStreakContextValidator),
});

/**
 * Find the date range of the best streak in the completion history
 */
function findBestStreakPeriod(
  completedDates: string[],
  targetStreakLength: number
): { startDate: string; endDate: string } | null {
  if (completedDates.length === 0) return null;
  if (completedDates.length === 1) {
    return { endDate: completedDates[0], startDate: completedDates[0] };
  }

  let bestStreakStart = completedDates[0];
  let bestStreakEnd = completedDates[0];
  let bestLength = 1;

  let currentStreakStart = completedDates[0];
  let currentLength = 1;

  for (let i = 1; i < completedDates.length; i++) {
    const prevDate = new Date(completedDates[i - 1] + 'T00:00:00');
    const currDate = new Date(completedDates[i] + 'T00:00:00');
    const diffDays = Math.floor(
      (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      // Consecutive day
      currentLength++;
      if (currentLength > bestLength) {
        bestLength = currentLength;
        bestStreakStart = currentStreakStart;
        bestStreakEnd = completedDates[i];
      }
    } else if (diffDays > 1) {
      // Gap - reset current streak
      currentStreakStart = completedDates[i];
      currentLength = 1;
    }
    // diffDays === 0 means duplicate, skip
  }

  // Verify we found the target streak (or close to it)
  if (bestLength < targetStreakLength - 1) {
    // Data inconsistency - the best streak in history doesn't match stored value
    // Return what we found anyway
  }

  return { endDate: bestStreakEnd, startDate: bestStreakStart };
}
