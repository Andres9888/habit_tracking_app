/**
 * List Habits Query
 * Fetch all active habits for the authenticated user
 */
import { v } from 'convex/values';
import { query } from '../_generated/server';
import { projectHabitForList } from './projectListHabit';
import { listHabitValidator } from './types';

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const habits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
      .collect();

    const activeHabits = habits.filter((h) => h.archived !== true);

    const sortedHabits = activeHabits.sort((a, b) => {
      const aOrder = a.order ?? Infinity;
      const bOrder = b.order ?? Infinity;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return a._creationTime - b._creationTime;
    });

    return sortedHabits.map((habit) => projectHabitForList(habit));
  },
  returns: v.array(listHabitValidator),
});
