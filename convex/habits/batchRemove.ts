/** Batch Remove — permanently delete multiple habits and their tracking data */
import { v } from 'convex/values';
import { internal } from '../_generated/api';
import { mutation } from '../_generated/server';

export const batchRemove = mutation({
  args: { habitIds: v.array(v.id('habits')) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated: Must be logged in to delete habits');

    let deletedCount = 0;

    for (const habitId of args.habitIds) {
      const habit = await ctx.db.get(habitId);
      if (!habit) continue;
      if (habit.userId !== identity.subject) {
        throw new Error('Not authorized to delete this habit');
      }

      // Delete the habit immediately (removes it from the UI); its tracking
      // records drain asynchronously in bounded chunks so large histories
      // cannot breach Convex's per-transaction write limits. Orphaned tracking
      // is invisible to queries, which all filter by live habit ids.
      await ctx.db.delete(habitId);
      await ctx.scheduler.runAfter(
        0,
        internal.habits.deleteTrackingChunk.deleteTrackingChunk,
        { habitId }
      );
      deletedCount++;
    }

    return { deletedCount };
  },
  returns: v.object({ deletedCount: v.number() }),
});
