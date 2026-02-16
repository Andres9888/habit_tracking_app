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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    let affirmations;
    if (args.habitId) {
      // Verify habit ownership
      const habit = await ctx.db.get(args.habitId);
      if (!habit || habit.userId !== identity.subject) return [];

      affirmations = await ctx.db
        .query('affirmations')
        .withIndex('by_habit', (q) => q.eq('habitId', args.habitId!))
        .filter((q) => q.eq(q.field('isScheduleEnabled'), true))
        .collect();
    } else {
      affirmations = await ctx.db
        .query('affirmations')
        .withIndex('by_schedule', (q) => q.eq('isScheduleEnabled', true))
        .collect();
      // Filter to only user's affirmations
      affirmations = affirmations.filter((a) => a.userId === identity.subject);
    }
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const affirmation = await ctx.db.get(args.id);
    if (!affirmation) return null;

    // Ownership check via parent habit
    const habit = await ctx.db.get(affirmation.habitId);
    if (habit && habit.userId !== identity.subject) return null;

    return affirmation;
  },
  returns: v.union(v.null(), fullAffirmationReturn),
});
