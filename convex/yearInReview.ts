/**
 * Year In Review Query
 * Computes annual habit statistics for a Spotify Wrapped-style experience.
 *
 * Stats computed:
 * - Total completions this year
 * - Longest streak achieved (across all habits)
 * - Most consistent habit (highest completion rate)
 * - Best month (most completions)
 * - Total active days (days with at least one completion)
 * - Per-habit completion counts for ranking
 */
import { v } from 'convex/values';
import { query } from './_generated/server';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const getYearInReview = query({
  args: { year: v.number() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const userId = identity.subject;
    const yearStr = String(args.year);

    // Get all user's habits
    const habits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .collect();

    if (habits.length === 0) return null;

    // Get all tracking entries for this year
    const allTracking = await ctx.db
      .query('tracking')
      .withIndex('by_user_and_date', (q) => q.eq('userId', userId))
      .collect();

    // Filter to this year's completed entries
    const yearTracking = allTracking.filter(
      (t) => t.completed && t.date.startsWith(yearStr)
    );

    if (yearTracking.length === 0) return null;

    const totalCompletions = yearTracking.length;

    // Active days — unique dates with at least one completion
    const activeDays = new Set(yearTracking.map((t) => t.date)).size;

    // Per-habit stats
    const habitCompletions = new Map<string, number>();
    const habitDates = new Map<string, string[]>();
    for (const t of yearTracking) {
      const hid = t.habitId as string;
      habitCompletions.set(hid, (habitCompletions.get(hid) ?? 0) + 1);
      const dates = habitDates.get(hid) ?? [];
      dates.push(t.date);
      habitDates.set(hid, dates);
    }

    // Most consistent habit (highest completions)
    let mostConsistentId = '';
    let mostConsistentCount = 0;
    for (const [hid, count] of habitCompletions) {
      if (count > mostConsistentCount) {
        mostConsistentCount = count;
        mostConsistentId = hid;
      }
    }
    const mostConsistentHabit = habits.find((h) => (h._id as string) === mostConsistentId);

    // Longest streak across all habits
    let longestStreak = 0;
    let longestStreakHabitName = '';
    for (const [hid, dates] of habitDates) {
      const sorted = [...dates].sort();
      let currentStreak = 1;
      let maxStreak = 1;
      for (let i = 1; i < sorted.length; i++) {
        const prev = new Date(sorted[i - 1]);
        const curr = new Date(sorted[i]);
        const diffDays = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
        if (Math.abs(diffDays - 1) < 0.01) {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else {
          currentStreak = 1;
        }
      }
      if (maxStreak > longestStreak) {
        longestStreak = maxStreak;
        const habit = habits.find((h) => (h._id as string) === hid);
        longestStreakHabitName = habit?.name ?? 'Unknown';
      }
    }

    // Best month
    const monthCounts = new Array(12).fill(0) as number[];
    for (const t of yearTracking) {
      const month = parseInt(t.date.split('-')[1], 10) - 1;
      monthCounts[month]++;
    }
    const bestMonthIndex = monthCounts.indexOf(Math.max(...monthCounts));
    const bestMonth = MONTH_NAMES[bestMonthIndex];
    const bestMonthCount = monthCounts[bestMonthIndex];

    // Top 5 habits
    const topHabits = [...habitCompletions.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([hid, count]) => {
        const habit = habits.find((h) => (h._id as string) === hid);
        return {
          name: habit?.name ?? 'Unknown',
          icon: (habit as Record<string, unknown>)?.icon as string | undefined ?? '✅',
          count,
        };
      });

    return {
      year: args.year,
      totalCompletions,
      activeDays,
      totalHabits: habits.length,
      longestStreak,
      longestStreakHabitName,
      mostConsistentHabit: mostConsistentHabit
        ? {
            name: mostConsistentHabit.name,
            icon: (mostConsistentHabit as Record<string, unknown>)?.icon as string | undefined ?? '✅',
            count: mostConsistentCount,
          }
        : null,
      bestMonth,
      bestMonthCount,
      topHabits,
    };
  },
});
