/**
 * Scheduled cleanup of soft-deleted habits.
 * Permanently removes habits (and all related data) that have been soft-deleted for 30+ days.
 */
import { internalMutation } from '../_generated/server';

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export const purgeDeleted = internalMutation({
  args: {},
  handler: async (ctx) => {
    const cutoff = Date.now() - THIRTY_DAYS_MS;

    const allHabits = await ctx.db.query('habits').collect();
    const expiredHabits = allHabits.filter(
      (h) => h.deleted === true && h.deletedAt != null && h.deletedAt < cutoff
    );

    let purgedCount = 0;

    for (const habit of expiredHabits) {
      // Delete all related tracking records
      const trackingEntries = await ctx.db
        .query('tracking')
        .withIndex('by_habit_and_date', (q) => q.eq('habitId', habit._id))
        .collect();
      for (const entry of trackingEntries) {
        await ctx.db.delete(entry._id);
      }

      // Delete related affirmations
      const affirmations = await ctx.db
        .query('affirmations')
        .withIndex('by_habit', (q) => q.eq('habitId', habit._id))
        .collect();
      for (const a of affirmations) {
        await ctx.db.delete(a._id);
      }

      // Delete related reflections
      const reflections = await ctx.db
        .query('reflections')
        .withIndex('by_habit', (q) => q.eq('habitId', habit._id))
        .collect();
      for (const r of reflections) {
        await ctx.db.delete(r._id);
      }

      // Delete related notes
      const notes = await ctx.db
        .query('notes')
        .withIndex('by_habit', (q) => q.eq('habitId', habit._id))
        .collect();
      for (const n of notes) {
        await ctx.db.delete(n._id);
      }

      // Delete related letters
      const letters = await ctx.db
        .query('letters')
        .withIndex('by_habit', (q) => q.eq('habitId', habit._id))
        .collect();
      for (const l of letters) {
        await ctx.db.delete(l._id);
      }

      // Delete related voice notes
      const voiceNotes = await ctx.db
        .query('voiceNotes')
        .withIndex('by_habit', (q) => q.eq('habitId', habit._id))
        .collect();
      for (const vn of voiceNotes) {
        await ctx.db.delete(vn._id);
      }

      // Delete related vision board items
      const visionItems = await ctx.db
        .query('visionBoardItems')
        .withIndex('by_habit', (q) => q.eq('habitId', habit._id))
        .collect();
      for (const vi of visionItems) {
        await ctx.db.delete(vi._id);
      }

      // Delete related vision board images
      const visionImages = await ctx.db
        .query('visionBoardImages')
        .withIndex('by_habit', (q) => q.eq('habitId', habit._id))
        .collect();
      for (const vi of visionImages) {
        await ctx.db.delete(vi._id);
      }

      // Finally delete the habit document itself
      await ctx.db.delete(habit._id);
      purgedCount++;
    }

    return { purgedCount };
  },
});
