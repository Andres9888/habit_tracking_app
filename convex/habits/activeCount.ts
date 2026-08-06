/**
 * Active-habit counting for free-tier enforcement.
 *
 * "Active" means what the tier boundary means to a user: a habit that is
 * currently on their list. Archived habits do not count (archiving is the
 * documented way to make room), and neither do paused ones — pausing is the
 * lighter-weight version of the same escape hatch, and the unarchive path has
 * always excluded them. Counting paused habits here would make the two paths
 * disagree about how full the free plan is.
 */
import type { MutationCtx, QueryCtx } from '../_generated/server';

/**
 * Count a user's active (non-archived, non-paused) habits.
 *
 * @param ctx - Convex query or mutation context
 * @param userId - Clerk subject for the habit owner
 * @returns Number of habits occupying a free-tier slot
 */
export async function countActiveHabits(
  ctx: QueryCtx | MutationCtx,
  userId: string
): Promise<number> {
  // Filter rather than an `archived` index lookup: a never-archived habit has
  // no `archived` field at all, while an unarchived one carries `false`, so an
  // equality read on the index would silently miss one of the two shapes.
  const active = await ctx.db
    .query('habits')
    .withIndex('by_userId', (q) => q.eq('userId', userId))
    .filter((q) => q.neq(q.field('archived'), true))
    .collect();
  return active.filter((habit) => !habit.paused).length;
}
