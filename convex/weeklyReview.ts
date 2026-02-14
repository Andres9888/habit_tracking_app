/**
 * Weekly Review - Convex queries & mutations
 *
 * Generates weekly habit summaries for the review/insights card.
 * Premium users get detailed insights; free users get a basic summary.
 */

import { v } from 'convex/values';
import { query } from './_generated/server';

/**
 * Get the weekly review summary for the current user.
 *
 * Returns completions by day, streaks maintained, best day,
 * habits that improved vs declined, and overall stats.
 */
export const getWeeklyReview = query({
  args: {
    /** ISO date string for the Monday that starts the review week */
    weekStartDate: v.string(),
    /** Whether the user has premium access */
    isPremium: v.boolean(),
  },
  handler: async (ctx, { weekStartDate, isPremium }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const userId = identity.subject;

    // Calculate the 7-day range (Mon–Sun)
    const weekStart = new Date(weekStartDate);
    const dates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }

    // Fetch all habits for the user
    const habits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q: any) => q.eq('userId', userId))
      .collect();
    const activeHabits = habits.filter((h) => !h.archived && !h.paused);

    if (activeHabits.length === 0) {
      return null;
    }

    // Fetch all tracking records for the user in this period
    const allTracking = await ctx.db
      .query('tracking')
      .withIndex('by_user_and_date', (q: any) => q.eq('userId', userId))
      .collect();

    const weekTracking = allTracking.filter(
      (t) => dates.includes(t.date) && t.completed
    );

    // Previous week for comparison
    const prevDates: string[] = [];
    for (let i = -7; i < 0; i++) {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      prevDates.push(d.toISOString().split('T')[0]);
    }
    const prevWeekTracking = allTracking.filter(
      (t) => prevDates.includes(t.date) && t.completed
    );

    // Completions by day of week
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const completionsByDay = dates.map((date, i) => ({
      day: dayNames[i],
      date,
      count: weekTracking.filter((t) => t.date === date).length,
      total: activeHabits.length,
    }));

    // Best day
    const bestDayEntry = completionsByDay.reduce((best, curr) =>
      curr.count > best.count ? curr : best
    );

    // Per-habit stats
    const habitStats = activeHabits.map((habit) => {
      const thisWeek = weekTracking.filter(
        (t) => t.habitId === habit._id
      ).length;
      const lastWeek = prevWeekTracking.filter(
        (t) => t.habitId === habit._id
      ).length;
      return {
        habitId: habit._id,
        name: habit.name,
        icon: habit.icon || '📌',
        thisWeek,
        lastWeek,
        change: thisWeek - lastWeek,
        currentStreak: habit.currentStreak || 0,
        bestStreak: habit.bestStreak || 0,
        strength: habit.strength,
        strengthLevel: habit.strengthLevel,
      };
    });

    const totalCompletions = weekTracking.length;
    const totalPossible = activeHabits.length * 7;
    const completionRate = totalPossible > 0
      ? Math.round((totalCompletions / totalPossible) * 100)
      : 0;
    const prevTotalCompletions = prevWeekTracking.length;
    const weekOverWeekChange = totalCompletions - prevTotalCompletions;

    // Streaks maintained (habits with streak >= 7 at end of week)
    const streaksMaintained = habitStats.filter(
      (h) => h.currentStreak >= 7
    );

    // Improved habits (more completions than last week)
    const improved = habitStats.filter((h) => h.change > 0);
    // Declined habits (fewer completions than last week)
    const declined = habitStats.filter((h) => h.change < 0);
    // Perfect habits (7/7)
    const perfectHabits = habitStats.filter((h) => h.thisWeek === 7);

    // Basic summary (free users)
    const basicSummary = {
      totalCompletions,
      totalPossible,
      completionRate,
      bestDay: bestDayEntry.day,
      bestDayCount: bestDayEntry.count,
      weekOverWeekChange,
      perfectCount: perfectHabits.length,
      streaksMaintainedCount: streaksMaintained.length,
      activeHabitCount: activeHabits.length,
      completionsByDay,
      generatedAt: new Date().toISOString(),
      weekStartDate,
    };

    if (!isPremium) {
      return {
        ...basicSummary,
        isPremium: false,
      };
    }

    // Premium: detailed per-habit breakdown
    return {
      ...basicSummary,
      isPremium: true,
      habitStats,
      improved,
      declined,
      perfectHabits: perfectHabits.map((h) => ({
        name: h.name,
        icon: h.icon,
        streak: h.currentStreak,
      })),
      streaksMaintained: streaksMaintained.map((h) => ({
        name: h.name,
        icon: h.icon,
        streak: h.currentStreak,
        bestStreak: h.bestStreak,
      })),
      topHabit: habitStats.reduce((best, curr) =>
        curr.thisWeek > best.thisWeek ? curr : best
      ),
      prevTotalCompletions,
    };
  },
});
