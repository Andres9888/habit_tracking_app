/**
 * Bulk pause — the churn-save path behind "Pause my habits instead".
 *
 * Offered above Delete account so a user who wants a break takes one instead
 * of destroying their history. Pausing preserves streaks and strength (paused
 * spans are excluded from streak maths), so the account is fully recoverable.
 */
import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { recalculateOnPauseChange } from './pauseHelpers';

export const pauseAll = mutation({
  args: {
    timezone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to pause habits');
    }

    // Ownership is implicit: only this user's habits are ever read.
    const habits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
      .collect();

    const targets = habits.filter(
      (habit) => habit.archived !== true && habit.paused !== true
    );

    const now = Date.now();
    for (const habit of targets) {
      const pausePatch = {
        accessibilityAtPause: habit.accessibility,
        paused: true,
        pausedAt: now,
        strengthAtPause: habit.strength,
      };
      await ctx.db.patch(habit._id, pausePatch);
      // Hand over the post-patch document so the helper does not re-read a doc
      // we already hold — that read was an N+1 across every habit.
      await recalculateOnPauseChange(ctx, habit._id, args.timezone, {
        ...habit,
        ...pausePatch,
      });
    }

    return { pausedCount: targets.length, success: true };
  },
  returns: v.object({
    pausedCount: v.number(),
    success: v.boolean(),
  }),
});
