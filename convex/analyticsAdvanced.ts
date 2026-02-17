/**
 * Advanced Analytics API
 *
 * Extended analytics features:
 * - 16-week GitHub-style heatmap data
 * - Streak trends over time
 * - Best/worst day analysis with hour-of-day breakdown
 * - Completion streak intervals statistics
 */

import { query } from './_generated/server';
import { getDateString, getDaysAgo, getCompletionLevel } from './analytics/index';
import { computeStreakFromDates } from './analytics/streakHelpers';

/**
 * Get 16-week (112 days) heatmap data for GitHub-style visualization
 */
export const getGitHubHeatmapData = query({
  args: {},
  handler: async (ctx) => {
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    // SEC-001: Query only current user's habits
    const habits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
      .collect();
    const activeHabits = habits.filter((h) => !h.archived && !h.paused);
    const habitIds = new Set(activeHabits.map((h) => h._id));

    // Single query for all tracking records
    const allTrackings = await ctx.db
      .query('tracking')
      .withIndex('by_user_and_date', (q) => q.eq('userId', identity.subject))
      .collect();

    const trackings = allTrackings.filter((t) => habitIds.has(t.habitId));

    // Build heatmap data for last 16 weeks (112 days)
    const heatmapData: Array<{
      date: string;
      completionRate: number;
      level: 'none' | 'low' | 'medium' | 'high';
      completedHabits: number;
      totalHabits: number;
      dayOfWeek: number; // 0-6 (Sunday-Saturday)
      weekIndex: number; // 0-15 (for 16 weeks)
    }> = [];

    for (let i = 111; i >= 0; i--) {
      const date = getDaysAgo(i);
      const dateStr = getDateString(date);

      const dayCompletions = trackings.filter(
        (t) => t.date === dateStr && t.completed && habitIds.has(t.habitId)
      );

      const completionRate =
        activeHabits.length > 0
          ? (dayCompletions.length / activeHabits.length) * 100
          : 0;

      heatmapData.push({
        completedHabits: dayCompletions.length,
        completionRate,
        date: dateStr,
        dayOfWeek: date.getDay(),
        weekIndex: Math.floor(i / 7),
        level: getCompletionLevel(completionRate),
        totalHabits: activeHabits.length,
      });
    }

    return heatmapData;
  },
});

/**
 * Get streak trends over time (last 30 days)
 */
export const getStreakTrends = query({
  args: {},
  handler: async (ctx) => {
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    // SEC-001: Query only current user's habits
    const habits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
      .collect();
    const activeHabits = habits.filter((h) => !h.archived && !h.paused);
    const habitIds = new Set(activeHabits.map((h) => h._id));

    // Single query for all tracking records
    const allTrackings = await ctx.db
      .query('tracking')
      .withIndex('by_user_and_date', (q) => q.eq('userId', identity.subject))
      .collect();

    const trackings = allTrackings.filter((t) => habitIds.has(t.habitId));

    // Build streak trend data for last 30 days
    const streakData: Array<{
      date: string;
      averageStreak: number;
      maxStreak: number;
      minStreak: number;
    }> = [];

    for (let i = 29; i >= 0; i--) {
      const date = getDaysAgo(i);
      const dateStr = getDateString(date);

      // Group completions by habit for this day
      const habitCompletions = new Map<string, string[]>();
      for (const tracking of trackings) {
        if (tracking.date <= dateStr && habitIds.has(tracking.habitId)) {
          const key = String(tracking.habitId);
          const dates = habitCompletions.get(key) || [];
          if (tracking.completed) {
            dates.push(tracking.date);
          }
          habitCompletions.set(key, dates);
        }
      }

      // Compute streak for each habit as of this day
      const streaks: number[] = [];
      for (const [habitId, dates] of habitCompletions) {
        // Filter dates <= current date
        const relevantDates = dates.filter((d) => d <= dateStr);
        const sortedDates = relevantDates.sort();
        const streakResult = computeStreakFromDates(sortedDates);
        streaks.push(streakResult.currentStreak);
      }

      if (streaks.length > 0) {
        streakData.push({
          date: dateStr,
          averageStreak: streaks.reduce((a, b) => a + b, 0) / streaks.length,
          maxStreak: Math.max(...streaks),
          minStreak: Math.min(...streaks),
        });
      } else {
        streakData.push({
          date: dateStr,
          averageStreak: 0,
          maxStreak: 0,
          minStreak: 0,
        });
      }
    }

    return streakData;
  },
});

/**
 * Get best/worst day analysis with hour-of-day breakdown
 */
export const getDayAnalysis = query({
  args: {},
  handler: async (ctx) => {
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // SEC-001: Query only current user's habits
    const habits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
      .collect();
    const activeHabits = habits.filter((h) => !h.archived && !h.paused);
    const habitIds = new Set(activeHabits.map((h) => h._id));

    // Get last 90 days of tracking data
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    // Query tracking with timestamp filter
    const allTrackings = await ctx.db
      .query('tracking')
      .withIndex('by_user_and_date', (q) => q.eq('userId', identity.subject))
      .collect();

    // Filter by date and active habits
    const trackings = allTrackings.filter(
      (t) =>
        habitIds.has(t.habitId) &&
        new Date(t.date) >= ninetyDaysAgo &&
        t.completed
    );

    // Analyze by day of week
    const dayOfWeekStats = Array.from({ length: 7 }, (_, i) => ({
      dayOfWeek: i,
      totalCompletions: 0,
      totalTracked: 0,
      completionRate: 0,
    }));

    // Analyze by hour of day (if tracking has timestamp data)
    const hourStats = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      completions: 0,
    }));

    for (const tracking of trackings) {
      const date = new Date(tracking.date);
      const dayOfWeek = date.getDay();
      const dayStats = dayOfWeekStats[dayOfWeek];
      dayStats.totalCompletions++;
      dayStats.totalTracked++;

      // If we have timestamp data (would need to be stored in tracking)
      // For now, we'll just use a placeholder for hour breakdown
      const hour = date.getHours();
      hourStats[hour].completions++;
    }

    // Calculate completion rates by day of week
    const dayStatsWithRates = dayOfWeekStats.map((stat) => ({
      ...stat,
      completionRate:
        stat.totalTracked > 0 ? (stat.totalCompletions / stat.totalTracked) * 100 : 0,
    }));

    // Find best and worst days
    const sortedDays = [...dayStatsWithRates].sort(
      (a, b) => b.completionRate - a.completionRate
    );
    const bestDay = sortedDays[0];
    const worstDay = sortedDays[sortedDays.length - 1];

    // Find peak hour
    const peakHour = hourStats.reduce((max, stat) =>
      stat.completions > max.completions ? stat : max
    );

    return {
      bestDay: {
        dayOfWeek: bestDay.dayOfWeek,
        completionRate: bestDay.completionRate,
        totalCompletions: bestDay.totalCompletions,
      },
      worstDay: {
        dayOfWeek: worstDay.dayOfWeek,
        completionRate: worstDay.completionRate,
        totalCompletions: worstDay.totalCompletions,
      },
      peakHour: {
        hour: peakHour.hour,
        completions: peakHour.completions,
      },
      dayOfWeekStats: dayStatsWithRates,
      hourStats: hourStats.filter((h) => h.completions > 0),
      period: '90 days',
    };
  },
});

/**
 * Get completion streak intervals statistics
 */
export const getStreakIntervals = query({
  args: {},
  handler: async (ctx) => {
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // SEC-001: Query only current user's habits
    const habits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
      .collect();
    const activeHabits = habits.filter((h) => !h.archived && !h.paused);
    const habitIds = new Set(activeHabits.map((h) => h._id));

    // Single query for all tracking records
    const allTrackings = await ctx.db
      .query('tracking')
      .withIndex('by_user_and_date', (q) => q.eq('userId', identity.subject))
      .collect();

    const trackings = allTrackings.filter((t) => habitIds.has(t.habitId));

    // Collect all streak lengths across all habits
    const allStreakLengths: number[] = [];

    for (const habitId of habitIds) {
      const habitTrackings = trackings
        .filter((t) => String(t.habitId) === String(habitId) && t.completed)
        .map((t) => t.date)
        .sort();

      const streakResult = computeStreakFromDates(habitTrackings);
      allStreakLengths.push(streakResult.currentStreak);
      allStreakLengths.push(streakResult.longestStreak);
    }

    // Calculate statistics
    const averageStreak =
      allStreakLengths.length > 0
        ? allStreakLengths.reduce((a, b) => a + b, 0) / allStreakLengths.length
        : 0;
    const longestStreak =
      allStreakLengths.length > 0 ? Math.max(...allStreakLengths) : 0;

    // Current streak (today)
    const today = new Date();
    const todayStr = getDateString(today);
    const todayCompletions = trackings.filter(
      (t) => t.date === todayStr && t.completed && habitIds.has(t.habitId)
    );

    let currentStreak = 0;
    if (todayCompletions.length > 0) {
      // Check yesterday's completions to determine if streak is active
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = getDateString(yesterday);
      const yesterdayCompletions = trackings.filter(
        (t) => t.date === yesterdayStr && t.completed && habitIds.has(t.habitId)
      );

      // Simple current streak based on recent consecutive completions
      let consecutiveDays = 0;
      let checkDate = today;
      while (true) {
        const checkDateStr = getDateString(checkDate);
        const dayCompletions = trackings.filter(
          (t) => t.date === checkDateStr && t.completed && habitIds.has(t.habitId)
        );
        if (dayCompletions.length === 0) break;
        consecutiveDays++;
        checkDate.setDate(checkDate.getDate() - 1);
      }
      currentStreak = consecutiveDays;
    }

    return {
      averageStreak: Math.round(averageStreak * 10) / 10,
      longestStreak,
      currentStreak,
      totalStreaks: allStreakLengths.length,
      activeHabitsCount: activeHabits.length,
    };
  },
});

/**
 * Get detailed analytics data for CSV export
 */
export const getAnalyticsExportData = query({
  args: {},
  handler: async (ctx) => {
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // SEC-001: Query only current user's habits
    const habits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
      .collect();
    const activeHabits = habits.filter((h) => !h.archived && !h.paused);

    // Single query for all tracking records
    const allTrackings = await ctx.db
      .query('tracking')
      .withIndex('by_user_and_date', (q) => q.eq('userId', identity.subject))
      .collect();

    // Get streak data for each habit
    const habitIds = activeHabits.map((h) => h._id);
    const trackingsByHabit = new Map<string, string[]>();

    for (const tracking of allTrackings) {
      const key = String(tracking.habitId);
      const dates = trackingsByHabit.get(key) || [];
      if (tracking.completed) {
        dates.push(tracking.date);
      }
      trackingsByHabit.set(key, dates);
    }

    const exportData = activeHabits.map((habit) => {
      const dates = trackingsByHabit.get(String(habit._id)) || [];
      const sortedDates = dates.sort();
      const streakResult = computeStreakFromDates(sortedDates);

      // Calculate last 30 days completion rate
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      let completedLast30Days = 0;
      for (const date of sortedDates) {
        if (new Date(date) >= thirtyDaysAgo) {
          completedLast30Days++;
        }
      }

      const last30DaysRate =
        sortedDates.length > 0 ? (completedLast30Days / 30) * 100 : 0;

      return {
        habitId: String(habit._id),
        habitName: habit.name,
        habitIcon: habit.icon || '',
        habitEmoji: habit.emoji || '',
        strength: habit.strength || 0,
        totalCompletions: habit.totalCompletions || 0,
        currentStreak: streakResult.currentStreak,
        longestStreak: streakResult.longestStreak,
        bestStreak: habit.bestStreak || 0,
        last30DaysRate: Math.round(last30DaysRate * 10) / 10,
        createdAt: new Date(habit.createdAt).toISOString(),
        lastCompletedDate: habit.lastCompletedDate || 'Never',
        frequency: habit.frequency || 'daily',
      };
    });

    return {
      habits: exportData,
      exportedAt: new Date().toISOString(),
      period: 'all time',
    };
  },
});
