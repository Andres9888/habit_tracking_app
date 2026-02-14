/**
 * List Habits Query
 * Fetch all active habits for the authenticated user, including paused habits
 * Paused habits are included but marked - UI should handle them differently
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

    // Filter out only archived habits - include paused habits in the list
    // UI will handle paused habits with dimmed appearance and "Paused" badge
    const activeHabits = habits.filter((h) => h.archived !== true);

    // Sort by order field (ascending), use _creationTime as fallback
    // Paused habits go to the end
    const sortedHabits = activeHabits.sort((a, b) => {
      // Paused habits always go after active habits
      if (a.paused && !b.paused) return 1;
      if (!a.paused && b.paused) return -1;
      
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
