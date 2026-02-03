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
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to view scheduled affirmations');
    }

    let affirmations;
    
    if (args.habitId) {
      // SEC-001: Verify habit ownership
      const habit = await ctx.db.get(args.habitId);
      if (!habit) {
        throw new Error('Habit not found');
      }
      if (habit.userId !== identity.subject) {
        throw new Error('Not authorized to view affirmations for this habit');
      }

      affirmations = await ctx.db
        .query('affirmations')
        .withIndex('by_habit', (q) => q.eq('habitId', args.habitId!))
        .filter((q) => q.eq(q.field('isScheduleEnabled'), true))
        .collect();
    } else {
      // SEC-001: Filter by authenticated user
      affirmations = await ctx.db
        .query('affirmations')
        .withIndex('by_schedule', (q) => q.eq('isScheduleEnabled', true))
        .collect();
      
      // Filter to only user's affirmations
      affirmations = affirmations.filter(a => a.userId === identity.subject);
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
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to view affirmations');
    }

    const affirmation = await ctx.db.get(args.id);
    if (!affirmation) return null;

    // SEC-001: Ownership verification via affirmation's userId or parent habit
    if (affirmation.userId && affirmation.userId !== identity.subject) {
      throw new Error('Not authorized to view this affirmation');
    }
    const habit = await ctx.db.get(affirmation.habitId);
    if (habit && habit.userId !== identity.subject) {
      throw new Error('Not authorized to view this affirmation');
    }

    return affirmation;
  },
  returns: v.union(v.null(), fullAffirmationReturn),
});
