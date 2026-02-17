/**
 * Journal Entries Query API
 *
 * SEC-004: All queries require authentication and verify ownership
 */

import { v } from 'convex/values';
import { query } from './_generated/server';

/** Mood emoji type validator */
const moodValidator = v.union(
  v.literal('frustrated'),
  v.literal('neutral'),
  v.literal('happy'),
  v.literal('fire')
);

/** Journal entry object validator for return types */
const journalEntryObjectValidator = v.object({
  _creationTime: v.number(),
  _id: v.id('journalEntries'),
  createdAt: v.number(),
  habitId: v.id('habits'),
  mood: moodValidator,
  textContent: v.string(),
  updatedAt: v.number(),
  userId: v.optional(v.string()),
  whatWasHard: v.optional(v.string()),
  whatWentWell: v.optional(v.string()),
  whatWillChange: v.optional(v.string()),
});

/**
 * List journal entries for a habit, newest first
 * SEC-004: Requires authentication and habit ownership verification
 */
export const listByHabit = query({
  args: { habitId: v.id('habits'), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to view journal entries');
    }

    const habit = await ctx.db.get(args.habitId);
    if (!habit) throw new Error('Habit not found');
    if (habit.userId !== identity.subject) {
      throw new Error('Not authorized to view journal entries for this habit');
    }

    const q = ctx.db
      .query('journalEntries')
      .withIndex('by_habit', (query) => query.eq('habitId', args.habitId))
      .order('desc');

    return args.limit ? await q.take(args.limit) : await q.collect();
  },
  returns: v.array(journalEntryObjectValidator),
});

/**
 * Count journal entries for a habit (for premium gating)
 * SEC-004: Requires authentication and habit ownership verification
 */
export const countByHabit = query({
  args: { habitId: v.id('habits') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in');
    }

    const habit = await ctx.db.get(args.habitId);
    if (!habit) throw new Error('Habit not found');
    if (habit.userId !== identity.subject) {
      throw new Error('Not authorized');
    }

    const entries = await ctx.db
      .query('journalEntries')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .collect();

    return entries.length;
  },
  returns: v.number(),
});
