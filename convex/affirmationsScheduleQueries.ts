/**
 * Affirmations Schedule Queries
 *
 * Query operations for scheduled affirmations.
 */

import { v } from 'convex/values';
import { query } from './_generated/server';
import { fullAffirmationReturn } from './affirmations/index';

/**
 * Get all scheduled affirmations for a user
 */
export const listScheduled = query({
  args: { habitId: v.optional(v.id('habits')) },
  handler: async (ctx, args) => {
    const affirmations = args.habitId
      ? await ctx.db
          .query('affirmations')
          .withIndex('by_habit', (q) => q.eq('habitId', args.habitId!))
          .filter((q) => q.eq(q.field('isScheduleEnabled'), true))
          .collect()
      : await ctx.db
          .query('affirmations')
          .withIndex('by_schedule', (q) => q.eq('isScheduleEnabled', true))
          .collect();
    return affirmations;
  },
  returns: v.array(fullAffirmationReturn),
});

/**
 * Get a single affirmation with full schedule details
 */
export const get = query({
  args: { id: v.id('affirmations') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
  returns: v.union(v.null(), fullAffirmationReturn),
});
