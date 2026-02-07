/**
 * Affirmations API
 *
 * Positive self-talk cards tied to specific habits.
 * Based on:
 * - Self-affirmation theory (Steele, 1988)
 * - Sports psychology self-talk research (Hatzigeorgiadis et al., 2011)
 *
 * Three types:
 * - identity: "I am someone who..." (most powerful)
 * - motivational: "I can do hard things"
 * - instructional: "Progress, not perfection"
 */

import { v } from 'convex/values';
import { query } from './_generated/server';
import { basicAffirmationReturn } from './affirmations/index';

// Re-export types and helpers
export * from './affirmations/index';

/**
 * List all affirmations for a specific habit
 * SEC-001: Requires authentication and verifies habit ownership
 */
export const listByHabit = query({
  args: { habitId: v.id('habits') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const habit = await ctx.db.get(args.habitId);
    if (!habit || habit.userId !== identity.subject) return [];

    const affirmations = await ctx.db
      .query('affirmations')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .collect();
    return affirmations.sort((a, b) => b.createdAt - a.createdAt);
  },
  returns: v.array(basicAffirmationReturn),
});

// CRUD mutations
export { create, update, remove } from './affirmationsCRUD';

// Schedule mutations
export {
  cancelSchedule,
  get,
  listScheduled,
  recordDelivery,
  scheduleDelivery,
  toggleSchedule,
  updateNotificationId,
} from './affirmationsSchedule';

// AI generation actions
export {
  generateAffirmations,
  generateAndSaveAffirmations,
} from './affirmationsAI';
