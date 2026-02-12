/**
 * Get Single Habit Query
 * Fetch a habit by ID with computed strength
 */
import { v } from 'convex/values';
import { query } from '../_generated/server';
import { calculateMomentumStrengthSnapshot } from '../habitStrength';
import { fullHabitValidator } from './types';
import { getTodayDateKey, maxDateKey } from './utils';

export const get = query({
  args: { habitId: v.id('habits') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const habit = await ctx.db.get(args.habitId);
    if (!habit) return null;
    if (habit.userId !== identity.subject) return null;

    const tracking = await ctx.db
      .query('tracking')
      .withIndex('by_habit_and_date', (q) => q.eq('habitId', habit._id))
      .collect();

    const todayDateKey = getTodayDateKey();
    let maxTrackingDateKey = todayDateKey;
    for (const record of tracking) {
      maxTrackingDateKey = maxDateKey(maxTrackingDateKey, record.date);
    }
    const evaluationDateKey = maxDateKey(todayDateKey, maxTrackingDateKey);

    const snapshot = calculateMomentumStrengthSnapshot({
      habitCreatedAt: habit.createdAt,
      throughDate: evaluationDateKey,
      tracking: tracking.map((record) => ({
        completed: record.completed,
        date: record.date,
      })),
    });

    return {
      ...habit,
      strength: snapshot.strength,
      strengthLevel: snapshot.strengthLevel,
    };
  },
  returns: v.union(v.null(), fullHabitValidator),
});
