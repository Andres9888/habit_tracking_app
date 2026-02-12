/**
 * List Habits Query
 * Fetch all active habits for the authenticated user
 */
import { v } from 'convex/values';
import { query } from '../_generated/server';
import { calculateMomentumStrengthSnapshot } from '../habitStrength';
import { fullHabitValidator } from './types';
import { getTodayDateKey, maxDateKey } from './utils';

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const habitsForUser = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
      .collect();

    const habits = habitsForUser.filter(
      (habit) => habit.archived !== true && habit.paused !== true
    );

    // Sort by order field (ascending), use _creationTime as fallback
    const sortedHabits = habits.sort((a, b) => {
      const aOrder = a.order ?? Infinity;
      const bOrder = b.order ?? Infinity;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return a._creationTime - b._creationTime;
    });

    const todayDateKey = getTodayDateKey();
    const habitsWithComputedStrength: typeof sortedHabits = [];

    for (const habit of sortedHabits) {
      const tracking = await ctx.db
        .query('tracking')
        .withIndex('by_habit_and_date', (q) => q.eq('habitId', habit._id))
        .collect();

      let maxTrackingDateKey = todayDateKey;
      for (const record of tracking) {
        maxTrackingDateKey = maxDateKey(maxTrackingDateKey, record.date);
      }
      const evaluationDateKey = maxDateKey(todayDateKey, maxTrackingDateKey);

      const snapshot = calculateMomentumStrengthSnapshot({
        habitCreatedAt: habit.createdAt,
        throughDate: evaluationDateKey,
        tracking: tracking.map((r) => ({
          completed: r.completed,
          date: r.date,
        })),
      });

      habitsWithComputedStrength.push({
        ...habit,
        strength: snapshot.strength,
        strengthLevel: snapshot.strengthLevel,
      });
    }

    return habitsWithComputedStrength;
  },
  returns: v.array(fullHabitValidator),
});
