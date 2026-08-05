/**
 * Habit Statistics Query
 * Get streak and consistency stats for a habit
 */
import { v } from 'convex/values';
import { query } from '../_generated/server';
import { calculateStreakFromHistory } from '../streakUtils/historyCalculation';
import { getTrackingCutoffKey } from './utils';

export const getStats = query({
  args: { habitId: v.id('habits') },
  handler: async (ctx, args) => {
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { consistency: 0, streak: 0 };

    // SEC-001: Ownership verification — prevent cross-user data leakage
    const habit = await ctx.db.get(args.habitId);
    if (!habit || habit.userId !== identity.subject) {
      throw new Error('Not authorized to view this habit stats');
    }

    // Bounded — see getTrackingCutoffKey. This query returns only the current
    // streak and a 30-day consistency figure, both well inside the window.
    const tracking = await ctx.db
      .query('tracking')
      .withIndex('by_habit_and_date', (q) =>
        q.eq('habitId', args.habitId).gte('date', getTrackingCutoffKey())
      )
      .collect();

    // Use the canonical streak utility (timezone-safe, grace-period-aware)
    const todayDate = new Date().toISOString().slice(0, 10);
    const { currentStreak } = calculateStreakFromHistory(
      tracking,
      todayDate,
      { pausedAt: habit.pausedAt, resumedAt: habit.resumedAt }
    );

    // Compute expected completions in the last 30 days based on frequency
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setUTCDate(thirtyDaysAgo.getUTCDate() - 30);
    thirtyDaysAgo.setUTCHours(0, 0, 0, 0);

    const recentCompleted = tracking.filter((t) => {
      const date = new Date(t.date + 'T00:00:00Z');
      return date >= thirtyDaysAgo && t.completed;
    });

    // Expected days: weekly habits use daysOfWeek count × ~4.3 weeks; daily = 30
    const activeDaysPerWeek =
      habit.frequency === 'weekly' && habit.daysOfWeek?.length
        ? habit.daysOfWeek.length
        : 7;
    const expectedCompletions = Math.round((activeDaysPerWeek / 7) * 30);

    const consistency = Math.max(
      0,
      Math.min(100, Math.round((recentCompleted.length / expectedCompletions) * 100))
    );

    return { consistency, streak: currentStreak };
  },
  returns: v.object({ consistency: v.number(), streak: v.number() }),
});
