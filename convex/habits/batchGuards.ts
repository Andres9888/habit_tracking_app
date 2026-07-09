/**
 * Shared guards for batch habit mutations (batchArchive, batchUnarchive,
 * batchRemove).
 *
 * SEC: batch mutations accept arbitrary-length ID arrays, so without these
 * guards a single call could bypass per-action rate limits or partially
 * commit before hitting an unowned ID mid-loop.
 */
import type { Doc, Id } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';

/** Hard cap on IDs per batch call. UI batches are far smaller. */
export const MAX_BATCH_SIZE = 100;

/**
 * Validate a batch of habit IDs up front and return the owned habit docs.
 *
 * - Throws if the batch exceeds MAX_BATCH_SIZE.
 * - Throws if ANY id resolves to a habit owned by another user, BEFORE the
 *   caller mutates anything — batch ops stay all-or-nothing on authorization.
 * - Silently skips ids that no longer exist (deleted elsewhere) and
 *   deduplicates, matching prior per-item behavior.
 */
export async function loadOwnedHabitsForBatch(
  ctx: MutationCtx,
  userId: string,
  habitIds: Array<Id<'habits'>>,
  actionLabel: string
): Promise<Array<Doc<'habits'>>> {
  if (habitIds.length > MAX_BATCH_SIZE) {
    throw new Error(
      `Too many habits in one request (max ${MAX_BATCH_SIZE}).`
    );
  }

  const uniqueIds = [...new Set(habitIds)];
  const habits: Array<Doc<'habits'>> = [];
  for (const habitId of uniqueIds) {
    const habit = await ctx.db.get(habitId);
    if (!habit) continue;
    if (habit.userId !== userId) {
      throw new Error(`Not authorized to ${actionLabel} this habit`);
    }
    habits.push(habit);
  }
  return habits;
}
