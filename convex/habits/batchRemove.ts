/** Batch Remove — permanently delete multiple habits and their tracking data */
import { v } from 'convex/values';
import { internal } from '../_generated/api';
import { mutation } from '../_generated/server';
import { enforceRateLimit } from '../lib/rateLimit';
import { loadOwnedHabitsForBatch } from './batchGuards';

export const batchRemove = mutation({
  args: { habitIds: v.array(v.id('habits')) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated: Must be logged in to delete habits');
    await enforceRateLimit(ctx, identity.subject, 'habit.batch');

    // Pre-flight: validate size + ownership of every id before deleting any.
    const habits = await loadOwnedHabitsForBatch(
      ctx,
      identity.subject,
      args.habitIds,
      'delete'
    );

    let deletedCount = 0;

    for (const habit of habits) {
      // Delete the habit immediately (removes it from the UI); its tracking
      // records drain asynchronously in bounded chunks so large histories
      // cannot breach Convex's per-transaction write limits. Orphaned tracking
      // is invisible to queries, which all filter by live habit ids.
      await ctx.db.delete(habit._id);
      await ctx.scheduler.runAfter(
        0,
        internal.habits.deleteTrackingChunk.deleteTrackingChunk,
        { habitId: habit._id }
      );
      deletedCount++;
    }

    return { deletedCount };
  },
  returns: v.object({ deletedCount: v.number() }),
});
