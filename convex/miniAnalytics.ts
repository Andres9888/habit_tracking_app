/**
 * Mini Analytics Query
 *
 * Lightweight analytics for free users — today's completions,
 * best streak, weekly completion rate, and last 7 days breakdown.
 */

import { query } from './_generated/server';

export const getMiniStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const userId = identity.subject;

    // Get all active habits for this user
    const allHabits = await ctx.db.query('habits').collect();
    const habits = allHabits.filter(
      (h) => h.userId === userId && !h.archived && !h.paused
    );

    if (habits.length === 0) {
      return null;
    }

    const habitIds = new Set(habits.map((h) => h._id));

    // Build last 7 days date strings
    const now = new Date();
    const days: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().slice(0, 10));
    }

    const todayStr = days[days.length - 1];

    // Fetch all tracking records for these 7 days for this user
    const trackingRecords = await ctx.db
      .query('tracking')
      .withIndex('by_user_and_date')
      .filter((q) => q.eq(q.field('userId'), userId))
      .collect();

    // Filter to last 7 days and user's active habits
    const daysSet = new Set(days);
    const relevantRecords = trackingRecords.filter(
      (r) => r.completed && daysSet.has(r.date) && habitIds.has(r.habitId)
    );

    // Today's completions
    const completionsToday = relevantRecords.filter(
      (r) => r.date === todayStr
    ).length;

    // Weekly completion counts per day
    const dailyCounts = days.map((day) => ({
      date: day,
      count: relevantRecords.filter((r) => r.date === day).length,
      dayLabel: new Date(day + 'T12:00:00').toLocaleDateString('en-US', {
        weekday: 'short',
      }),
    }));

    // Weekly completion rate: completions / (habits × 7 days)
    const totalPossible = habits.length * 7;
    const totalCompleted = relevantRecords.length;
    const weeklyRate =
      totalPossible > 0
        ? Math.round((totalCompleted / totalPossible) * 100)
        : 0;

    // Best current streak across all habits
    // Use the streak data from habits table if available, else compute
    let bestStreak = 0;
    for (const habit of habits) {
      const streak =
        (habit as Record<string, unknown>).currentStreak ??
        (habit as Record<string, unknown>).streak ??
        0;
      if (typeof streak === 'number' && streak > bestStreak) {
        bestStreak = streak;
      }
    }

    // Max count for chart scaling
    const maxCount = Math.max(...dailyCounts.map((d) => d.count), 1);

    return {
      completionsToday,
      totalHabits: habits.length,
      bestStreak,
      weeklyRate,
      dailyCounts,
      maxCount,
    };
  },
});
