/**
 * Chunked tracking cleanup for deleted habits.
 *
 * Convex caps how many documents one mutation may write (~16k); long-history
 * accounts can exceed that if all tracking rows are deleted inline with the
 * habit, so cleanup drains in bounded scheduled chunks instead.
 */
import { v } from 'convex/values';
import { internal } from '../_generated/api';
import { internalMutation } from '../_generated/server';

const TRACKING_DELETE_CHUNK = 1000;

export const deleteTrackingChunk = internalMutation({
  args: { habitId: v.id('habits') },
  handler: async (ctx, { habitId }) => {
    const records = await ctx.db
      .query('tracking')
      .withIndex('by_habit_and_date', (q) => q.eq('habitId', habitId))
      .take(TRACKING_DELETE_CHUNK);
    for (const record of records) {
      await ctx.db.delete(record._id);
    }
    if (records.length === TRACKING_DELETE_CHUNK) {
      await ctx.scheduler.runAfter(
        0,
        internal.habits.deleteTrackingChunk.deleteTrackingChunk,
        { habitId }
      );
    }
    return null;
  },
  returns: v.null(),
});
