/**
 * Voice Notes Best Streak Query
 *
 * Used in Rescue Mode to help users reconnect with their most committed self.
 */

import { v } from 'convex/values';
import { query } from './_generated/server';
import {
  voiceNoteWithStreakContextValidator,
  findBestStreakPeriod,
} from './voiceNotes/index';

/**
 * Get voice notes recorded during the user's best streak period
 *
 * Scientific Basis:
 * - Voice has 40% higher emotional recall than text
 * - Reconnecting with "peak motivation self" during struggle is powerful
 * - Hearing your own voice from your best streak creates emotional anchor
 */
export const getFromBestStreak = query({
  args: { habitId: v.id('habits'), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    // SEC: Authentication check — prevent cross-user data access
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const limit = args.limit ?? 3;
    const habit = await ctx.db.get(args.habitId);
    if (!habit) return [];

    // SEC: Ownership verification — only return data for the authenticated user's habits
    if (habit.userId !== identity.subject) return [];

    const bestStreak = habit.bestStreak ?? 0;
    if (bestStreak < 3) return [];

    const tracking = await ctx.db
      .query('tracking')
      .withIndex('by_habit_and_date', (q) => q.eq('habitId', args.habitId))
      .collect();

    const completedDates = tracking
      .filter((t) => t.completed)
      .map((t) => t.date)
      .sort((a, b) => a.localeCompare(b));

    if (completedDates.length === 0) return [];

    const bestStreakPeriod = findBestStreakPeriod(completedDates, bestStreak);
    if (!bestStreakPeriod) return [];

    const { startDate, endDate } = bestStreakPeriod;
    const startTimestamp = new Date(startDate + 'T00:00:00').getTime();
    const endTimestamp = new Date(endDate + 'T23:59:59').getTime();

    const allNotes = await ctx.db
      .query('voiceNotes')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .collect();

    const notesFromBestStreak = allNotes.filter(
      (note) =>
        note.createdAt >= startTimestamp && note.createdAt <= endTimestamp
    );

    if (notesFromBestStreak.length === 0) return [];

    const now = Date.now();
    const notesWithContext = notesFromBestStreak.map((note) => {
      const noteDate = new Date(note.createdAt);
      noteDate.setHours(0, 0, 0, 0);
      const streakStartDate = new Date(startDate + 'T00:00:00');
      const dayOfStreak =
        Math.floor(
          (noteDate.getTime() - streakStartDate.getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1;
      const daysAgo = Math.floor(
        (now - note.createdAt) / (1000 * 60 * 60 * 24)
      );
      return { ...note, daysAgo, streakAtRecording: dayOfStreak };
    });

    return notesWithContext
      .sort((a, b) => b.streakAtRecording - a.streakAtRecording)
      .slice(0, limit);
  },
  returns: v.array(voiceNoteWithStreakContextValidator),
});
