/**
 * Weekly Summary query
 *
 * Returns data for the Weekly Summary screen:
 * - Habits completed this week (count + percentage)
 * - Best/worst day of the week
 * - Streak changes per habit
 * - Daily completions Mon-Sun for bar chart
 */

import { query } from './_generated/server';
import { Doc } from './_generated/dataModel';
import { getStreaksForHabitsBatch } from './analytics/index';

/** Get start of the current ISO week (Monday) */
function getWeekStart(now: Date): Date {
  const d = new Date(now);
  const day = d.getDay(); // 0=Sun
  const diff = day === 0 ? 6 : day - 1; // offset to Monday
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Format date as YYYY-MM-DD */
function fmt(d: Date): string {
  return d.toISOString().slice(0, 10);
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export const getWeeklySummary = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    // Fetch active habits
    const habits = await ctx.db.query('habits').collect();
    const activeHabits = habits.filter((h) => !h.archived && !h.paused);

    if (activeHabits.length === 0) {
      return {
        totalCompleted: 0,
        totalPossible: 0,
        completionPercentage: 0,
        bestDay: null,
        worstDay: null,
        dailyCompletions: DAY_LABELS.map((label) => ({ label, count: 0 })),
        streakChanges: [],
      };
    }

    const now = new Date();
    const weekStart = getWeekStart(now);

    // Previous week start for streak comparison
    const prevWeekStart = new Date(weekStart);
    prevWeekStart.setDate(prevWeekStart.getDate() - 7);

    // Fetch all tracking records for this user
    const trackings: Doc<'tracking'>[] = await ctx.db
      .query('tracking')
      .withIndex('by_user_and_date', (q) =>
        q.eq('userId', identity.subject)
      )
      .collect();

    // Build dates for this week (Mon-Sun)
    const weekDates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      weekDates.push(fmt(d));
    }

    // Build dates for previous week
    const prevWeekDates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(prevWeekStart);
      d.setDate(d.getDate() + i);
      prevWeekDates.push(fmt(d));
    }

    const weekDateSet = new Set(weekDates);
    const prevWeekDateSet = new Set(prevWeekDates);
    const habitIdSet = new Set(activeHabits.map((h) => String(h._id)));

    // Filter to relevant trackings
    const thisWeekTrackings = trackings.filter(
      (t) => t.completed && weekDateSet.has(t.date) && habitIdSet.has(String(t.habitId))
    );
    const prevWeekTrackings = trackings.filter(
      (t) => t.completed && prevWeekDateSet.has(t.date) && habitIdSet.has(String(t.habitId))
    );

    // Daily completions (Mon-Sun)
    const dailyCompletions = weekDates.map((date, i) => {
      const count = thisWeekTrackings.filter((t) => t.date === date).length;
      return { label: DAY_LABELS[i], count };
    });

    // Total completed vs possible
    // Only count days up to today
    const todayStr = fmt(now);
    const daysElapsed = weekDates.filter((d) => d <= todayStr).length;
    const totalPossible = activeHabits.length * daysElapsed;
    const totalCompleted = thisWeekTrackings.length;
    const completionPercentage =
      totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

    // Best and worst day
    const daysWithData = dailyCompletions.filter(
      (_, i) => weekDates[i] <= todayStr
    );
    const bestDay =
      daysWithData.length > 0
        ? daysWithData.reduce((a, b) => (b.count > a.count ? b : a))
        : null;
    const worstDay =
      daysWithData.length > 0
        ? daysWithData.reduce((a, b) => (b.count < a.count ? b : a))
        : null;

    // Streak changes per habit
    const habitIds = activeHabits.map((h) => h._id);
    const streaksMap = await getStreaksForHabitsBatch(ctx, habitIds);

    // Count completions per habit this week vs last week
    const streakChanges = activeHabits.map((habit) => {
      const hid = String(habit._id);
      const thisWeekCount = thisWeekTrackings.filter(
        (t) => String(t.habitId) === hid
      ).length;
      const prevWeekCount = prevWeekTrackings.filter(
        (t) => String(t.habitId) === hid
      ).length;
      const streaks = streaksMap.get(habit._id) ?? {
        currentStreak: 0,
        longestStreak: 0,
      };
      return {
        name: habit.name,
        emoji: habit.icon || '🎯',
        currentStreak: streaks.currentStreak,
        thisWeek: thisWeekCount,
        lastWeek: prevWeekCount,
        change: thisWeekCount - prevWeekCount,
      };
    });

    return {
      totalCompleted,
      totalPossible,
      completionPercentage,
      bestDay: bestDay ? { label: bestDay.label, count: bestDay.count } : null,
      worstDay: worstDay
        ? { label: worstDay.label, count: worstDay.count }
        : null,
      dailyCompletions,
      streakChanges,
    };
  },
});
