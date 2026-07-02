/**
 * Recalculate Stale Habit Strength (Cron Internal Mutation)
 *
 * Background reconciliation that walks active habits whose `strengthUpdatedAt`
 * is older than `staleAfterMs` and recomputes strength + streak from full
 * tracking history. Prevents the "instant decay on toggle" UX: between
 * toggles the stored strength is frozen, so a daily catch-up keeps the
 * displayed value at most ~24h stale.
 */
import { v } from 'convex/values';
import { internal } from '../_generated/api';
import { internalMutation } from '../_generated/server';
import {
  buildContinuationArgs,
  resolveRecalculateStaleArgs,
} from './recalcStaleArgs';
import { recalculateHabitStrength } from './recalcStaleHelpers';

const DEFAULT_STALE_MS = 23 * 60 * 60 * 1000;
const DEFAULT_BATCH_SIZE = 100;

export const recalculateStaleStrength = internalMutation({
  args: {
    batchSize: v.optional(v.number()),
    cutoff: v.optional(v.number()),
    cursor: v.optional(v.union(v.string(), v.null())),
    staleAfterMs: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { batchSize, cutoff, staleAfterMs } = resolveRecalculateStaleArgs(
      args,
      {
        batchSize: DEFAULT_BATCH_SIZE,
        cutoff: Date.now() - DEFAULT_STALE_MS,
        staleAfterMs: DEFAULT_STALE_MS,
      }
    );

    const pageResult = await ctx.db
      .query('habits')
      .withIndex('by_strengthUpdatedAt', (q) =>
        q.lt('strengthUpdatedAt', cutoff)
      )
      .paginate({ cursor: args.cursor ?? null, numItems: batchSize });

    const candidates = pageResult.page.filter(
      (habit) =>
        !habit.archived && !habit.paused && !habit.pendingStrengthRecalcId
    );

    let processed = 0;
    let failed = 0;

    for (const habit of candidates) {
      try {
        await recalculateHabitStrength(ctx, habit);
        processed += 1;
      } catch (error) {
        failed += 1;
        console.error('[recalculateStaleStrength] failed', {
          error,
          habitId: habit._id,
        });
      }
    }

    const nextCursor = pageResult.isDone ? null : pageResult.continueCursor;
    if (nextCursor) {
      await ctx.scheduler.runAfter(
        0,
        internal.habits.recalculateStaleStrength.recalculateStaleStrength,
        buildContinuationArgs({ batchSize, cutoff, staleAfterMs }, nextCursor)
      );
    }

    return {
      failed,
      isDone: pageResult.isDone,
      nextCursor,
      processed,
      rowsRead: pageResult.page.length,
    };
  },
  returns: v.object({
    failed: v.number(),
    isDone: v.boolean(),
    nextCursor: v.union(v.string(), v.null()),
    processed: v.number(),
    rowsRead: v.number(),
  }),
});
