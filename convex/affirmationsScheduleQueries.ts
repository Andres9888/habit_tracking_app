/**
 * Affirmations Schedule Queries
 *
 * Query operations for scheduled affirmations.
 * SEC-001: All queries require authentication and ownership verification
 */

import { v } from 'convex/values';
import { query } from './_generated/server';
import { fullAffirmationReturn } from './affirmations/index';

/**
 * Get all scheduled affirmations for a user
 * SEC-001: Requires authentication and ownership verification
 */
export const listScheduled = query({
  args: { habitId: v.optional(v.id('habits')) },
  handler: async (ctx, args) => {
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error(
        'Unauthenticated: Must be logged in to view affirmations'
      );
    }

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

    // SEC-001: Filter to only authenticated user's affirmations
    if (args.habitId) {
      const habit = await ctx.db.get(args.habitId);
      if (!habit) {
        return [];
      }
      if (habit.userId !== identity.subject) {
        throw new Error(
          'Not authorized to view affirmations for this habit'
        );
      }
    } else {
      // Filter affirmations to only those belonging to user's habits
      const userHabits = await ctx.db
        .query('habits')
        .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
        .collect();
      const habitIds = new Set(userHabits.map((h) => h._id));

      return affirmations.filter((a) => habitIds.has(a.habitId));
    }

    return affirmations;
  },
  returns: v.array(fullAffirmationReturn),
});

/**
 * Get a single affirmation with full schedule details
 * SEC-001: Requires authentication and ownership verification
 */
export const get = query({
  args: { id: v.id('affirmations') },
  handler: async (ctx, args) => {
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error(
        'Unauthenticated: Must be logged in to view affirmations'
      );
    }

    const affirmation = await ctx.db.get(args.id);
    if (!affirmation) {
      return null;
    }

    // SEC-001: Ownership verification via habit
    const habit = await ctx.db.get(affirmation.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }
    if (habit.userId !== identity.subject) {
      throw new Error('Not authorized to view this affirmation');
    }

    return affirmation;
  },
  returns: v.union(v.null(), fullAffirmationReturn),
});
