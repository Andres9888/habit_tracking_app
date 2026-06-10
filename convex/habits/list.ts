/**
 * List Habits Query
 * Fetch all active habits for the authenticated user
 */
import { v } from 'convex/values';
import { query } from '../_generated/server';
import { fullHabitValidator } from './types';

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    // Issue 9: Use by_userId index instead of full table scan with .filter()
    const habits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
      .collect();

    // Filter out archived and formed habits but include paused habits
    // (paused are shown differently in UI; formed live in their own section)
    const activeHabits = habits.filter(
      (h) => h.archived !== true && h.formed !== true
    );

    // Sort by order field (ascending), use _creationTime as fallback
    const sortedHabits = activeHabits.sort((a, b) => {
      const aOrder = a.order ?? Infinity;
      const bOrder = b.order ?? Infinity;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return a._creationTime - b._creationTime;
    });

    // Issue 4: Use stored strength/strengthLevel from habit documents
    // instead of recalculating from all tracking records on every query.
    // These fields are kept up-to-date by recalculateStreakAndStrength on toggle.
    return sortedHabits;
  },
  returns: v.array(fullHabitValidator),
});
