/**
 * ProgressSection Utility Functions
 *
 * Calculation functions for habit insights and statistics.
 */

import type { HabitTrackingEntry } from '../../features/habits/types';
import type { DayStats, StreakRecord, TrendComparison } from './types';
import {
  differenceInDays,
  getTodayString,
  formatDateString,
} from '../../utils/dateUtils';

// Day labels
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Calculate completion rate by day of week
 *
 * @param tracking - Array of habit tracking entries
 * @param habitCreatedAt - Optional timestamp when habit was created
 * @returns Array of DayStats for each day of the week
 */
export function calculateDayOfWeekStats(
  tracking: HabitTrackingEntry[],
  habitCreatedAt?: number
): DayStats[] {
  const dayStats: Record<number, { completed: number; total: number }> = {};

  // Initialize all days
  for (let i = 0; i < 7; i++) {
    dayStats[i] = { completed: 0, total: 0 };
  }

  // Get the start date (habit creation or first tracking entry)
  const startDate = habitCreatedAt
    ? new Date(habitCreatedAt)
    : tracking.length > 0
      ? new Date(tracking.at(-1).date)
      : new Date();

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  // Create a set of completed dates for quick lookup
  const completedDates = new Set(
    tracking.filter((t) => t.completed).map((t) => t.date)
  );

  // Iterate through each day from start to today
  const current = new Date(startDate);
  current.setHours(0, 0, 0, 0);

  while (current <= today) {
    const dayOfWeek = current.getDay();
    const dateStr = formatDateString(current);

    dayStats[dayOfWeek].total++;
    if (completedDates.has(dateStr)) {
      dayStats[dayOfWeek].completed++;
    }

    current.setDate(current.getDate() + 1);
  }

  return DAY_LABELS.map((day, index) => ({
    completed: dayStats[index].completed,
    day,
    dayIndex: index,
    rate:
      dayStats[index].total > 0
        ? Math.round((dayStats[index].completed / dayStats[index].total) * 100)
        : 0,
    total: dayStats[index].total,
  }));
}

/**
 * Calculate the current streak from tracking data
 * Uses UTC-normalized date utilities to match backend calculations
 *
 * @param tracking - Array of habit tracking entries
 * @returns Number of consecutive days in the current streak
 */
export function calculateCurrentStreak(tracking: HabitTrackingEntry[]): number {
  const completedDates = new Set(
    tracking.filter((t) => t.completed).map((t) => t.date)
  );

  if (completedDates.size === 0) return 0;

  let streak = 0;
  const todayStr = getTodayString();

  // Start from today or yesterday if today not completed
  let checkDate = todayStr;
  if (!completedDates.has(todayStr)) {
    // Get yesterday using proper date math
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    checkDate = formatDateString(yesterday);
  }

  // Count consecutive days backwards
  while (streak < 400) {
    if (completedDates.has(checkDate)) {
      streak++;
      // Go to previous day
      const [year, month, day] = checkDate.split('-').map(Number);
      const prevDate = new Date(year, month - 1, day);
      prevDate.setDate(prevDate.getDate() - 1);
      checkDate = formatDateString(prevDate);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Calculate all streak records from tracking data
 * Uses UTC-normalized date utilities for consistent calculation
 *
 * @param tracking - Array of habit tracking entries
 * @param currentStreak - Current active streak count
 * @returns Array of top 5 streak records sorted by length
 */
export function calculateStreakRecords(
  tracking: HabitTrackingEntry[],
  currentStreak: number
): StreakRecord[] {
  if (tracking.length === 0) return [];

  // Get all completed dates sorted (ascending)
  const completedDates = tracking
    .filter((t) => t.completed)
    .map((t) => t.date)
    .sort();

  if (completedDates.length === 0) return [];

  const streaks: StreakRecord[] = [];
  let streakStart = completedDates[0];
  let streakDays = 1;
  let prevDateStr = completedDates[0];

  for (let i = 1; i < completedDates.length; i++) {
    const currDateStr = completedDates[i];
    // Use consistent differenceInDays utility (UTC normalization)
    const diffDays = differenceInDays(currDateStr, prevDateStr);

    if (diffDays === 1) {
      // Consecutive day
      streakDays++;
    } else if (diffDays > 1) {
      // Gap found, save previous streak if >= 2 days
      if (streakDays >= 2) {
        streaks.push({
          days: streakDays,
          endDate: prevDateStr,
          isCurrent: false,
          startDate: streakStart,
        });
      }
      // Start new streak
      streakStart = currDateStr;
      streakDays = 1;
    }
    // If diffDays === 0, same day entry (shouldn't happen with unique dates), skip

    prevDateStr = currDateStr;
  }

  // Don't forget the last streak
  if (streakDays >= 2) {
    const today = getTodayString();
    const lastDate = completedDates.at(-1);
    // Check if last date is today or yesterday (streak is still active)
    const daysSinceLastCompletion = differenceInDays(today, lastDate);
    const isCurrent = daysSinceLastCompletion <= 1;

    streaks.push({
      days: streakDays,
      endDate: lastDate,
      isCurrent: isCurrent && currentStreak > 0,
      startDate: streakStart,
    });
  }

  // Sort by days descending
  streaks.sort((a, b) => b.days - a.days);

  // Mark the current streak if it exists but wasn't captured
  if (currentStreak > 0) {
    const currentIdx = streaks.findIndex((s) => s.isCurrent);
    if (currentIdx === -1 && currentStreak >= 2) {
      // Current streak not in list, add it
      const today = getTodayString();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - currentStreak + 1);
      streaks.push({
        days: currentStreak,
        endDate: today,
        isCurrent: true,
        startDate: formatDateString(startDate),
      });
      streaks.sort((a, b) => b.days - a.days);
    }
  }

  return streaks.slice(0, 5); // Top 5
}

/**
 * Calculate trend comparison between this month and last month
 *
 * @param tracking - Array of habit tracking entries
 * @returns Object with thisMonth, lastMonth rates and change
 */
export function calculateTrendComparison(
  tracking: HabitTrackingEntry[]
): TrendComparison {
  const today = new Date();
  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

  let thisMonthCompleted = 0;
  let thisMonthTotal = 0;
  let lastMonthCompleted = 0;
  let lastMonthTotal = 0;

  const completedDates = new Set(
    tracking.filter((t) => t.completed).map((t) => t.date)
  );

  // This month
  const current = new Date(thisMonthStart);
  while (current <= today) {
    thisMonthTotal++;
    if (completedDates.has(formatDateString(current))) {
      thisMonthCompleted++;
    }
    current.setDate(current.getDate() + 1);
  }

  // Last month
  const lastCurrent = new Date(lastMonthStart);
  while (lastCurrent <= lastMonthEnd) {
    lastMonthTotal++;
    if (completedDates.has(formatDateString(lastCurrent))) {
      lastMonthCompleted++;
    }
    lastCurrent.setDate(lastCurrent.getDate() + 1);
  }

  const thisMonthRate =
    thisMonthTotal > 0
      ? Math.round((thisMonthCompleted / thisMonthTotal) * 100)
      : 0;
  const lastMonthRate =
    lastMonthTotal > 0
      ? Math.round((lastMonthCompleted / lastMonthTotal) * 100)
      : 0;

  return {
    change: thisMonthRate - lastMonthRate,
    lastMonth: lastMonthRate,
    thisMonth: thisMonthRate,
  };
}

/**
 * Generate an actionable tip based on user's weak days pattern
 *
 * @param dayStats - Array of day statistics
 * @param currentStreak - Current active streak count
 * @returns Actionable tip string
 */
export function generateActionableTip(
  dayStats: DayStats[],
  currentStreak: number
): string {
  // Find weak days (below 70% completion rate with at least some data)
  const weakDays = dayStats
    .filter((d) => d.total > 0 && d.rate < 70)
    .sort((a, b) => a.rate - b.rate)
    .slice(0, 2);

  // If user is on a good streak, encourage them
  if (currentStreak >= 7) {
    return 'Amazing streak! Keep the momentum going.';
  }

  // If there are weak days, suggest focusing on them
  if (weakDays.length > 0) {
    const dayNames = weakDays.map((d) => d.day).join(' & ');
    return `Focus on ${dayNames} to level up!`;
  }

  // If all days are good but short streak, encourage consistency
  if (currentStreak > 0 && currentStreak < 7) {
    return `${7 - currentStreak} more days to hit a week streak!`;
  }

  // Default tip
  return 'Complete today to start a new streak!';
}

/**
 * Get the best and worst performing days
 *
 * @param dayStats - Array of day statistics
 * @returns Object with bestDay and worstDay (or null if no data)
 */
export function getBestAndWorstDays(dayStats: DayStats[]): {
  bestDay: DayStats | null;
  worstDay: DayStats | null;
} {
  const withData = dayStats.filter((d) => d.total > 0);

  if (withData.length === 0) {
    return { bestDay: null, worstDay: null };
  }

  let bestDay = withData[0];
  let worstDay = withData[0];

  for (const day of withData) {
    if (day.rate > bestDay.rate) {
      bestDay = day;
    }
    if (day.rate < worstDay.rate) {
      worstDay = day;
    }
  }

  return { bestDay, worstDay };
}

/**
 * Calculate rolling 30-day consistency score with sparkline data
 *
 * The consistency index rewards regular completion and penalizes gaps:
 * - Base score from completion rate (0-60 points)
 * - Streak bonus for consecutive days (0-25 points)
 * - Recency bonus for recent completions (0-15 points)
 *
 * @param tracking - Array of habit tracking entries
 * @param habitCreatedAt - Timestamp when habit was created
 * @returns ConsistencyData with score, previousScore, change, and sparklineData
 */
export function calculateConsistencyIndex(
  tracking: HabitTrackingEntry[],
  habitCreatedAt?: number
): {
  score: number;
  previousScore: number;
  change: number;
  sparklineData: Array<{ date: string; completed: boolean; value: number }>;
  daysIncluded: number;
} {
  const today = new Date();
  const todayStr = getTodayString();

  // Determine start date (either 30 days ago or habit creation, whichever is later)
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29); // Include today

  const startDate = habitCreatedAt
    ? new Date(Math.max(thirtyDaysAgo.getTime(), habitCreatedAt))
    : thirtyDaysAgo;

  // Create set of completed dates for O(1) lookup
  const completedDates = new Set(
    tracking.filter((t) => t.completed).map((t) => t.date)
  );

  // Generate sparkline data for the last 30 days
  const sparklineData: Array<{
    date: string;
    completed: boolean;
    value: number;
  }> = [];
  let completedCount = 0;
  let currentStreak = 0;
  let maxStreakInPeriod = 0;
  let recentCompletions = 0; // Last 7 days

  const current = new Date(startDate);
  current.setHours(0, 0, 0, 0);

  while (current <= today) {
    const dateStr = formatDateString(current);
    const isCompleted = completedDates.has(dateStr);

    if (isCompleted) {
      completedCount++;
      currentStreak++;
      maxStreakInPeriod = Math.max(maxStreakInPeriod, currentStreak);

      // Check if in last 7 days
      const daysFromToday = differenceInDays(todayStr, dateStr);
      if (daysFromToday < 7) {
        recentCompletions++;
      }
    } else {
      currentStreak = 0;
    }

    // Calculate running consistency value for this point
    const daysIncluded = sparklineData.length + 1;
    const runningRate =
      daysIncluded > 0 ? (completedCount / daysIncluded) * 100 : 0;

    sparklineData.push({
      completed: isCompleted,
      date: dateStr,
      value: Math.round(runningRate),
    });

    current.setDate(current.getDate() + 1);
  }

  const daysIncluded = sparklineData.length;

  // Calculate base score components
  // 1. Completion rate (0-60 points)
  const completionRate = daysIncluded > 0 ? completedCount / daysIncluded : 0;
  const baseScore = Math.round(completionRate * 60);

  // 2. Streak bonus (0-25 points) - rewards consistent runs
  // Max bonus at 14+ day streak within the period
  const streakBonus = Math.min(25, Math.round((maxStreakInPeriod / 14) * 25));

  // 3. Recency bonus (0-15 points) - rewards recent activity
  // Max bonus at 7/7 completions in last week
  const recencyBonus = Math.round((recentCompletions / 7) * 15);

  const score = Math.min(100, baseScore + streakBonus + recencyBonus);

  // Calculate previous 30-day period score for comparison
  const sixtyDaysAgo = new Date(thirtyDaysAgo);
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 30);

  const prevStartDate = habitCreatedAt
    ? new Date(Math.max(sixtyDaysAgo.getTime(), habitCreatedAt))
    : sixtyDaysAgo;

  let prevCompletedCount = 0;
  let prevMaxStreak = 0;
  let prevCurrentStreak = 0;
  let prevDaysCount = 0;

  const prevCurrent = new Date(prevStartDate);
  prevCurrent.setHours(0, 0, 0, 0);
  const prevEnd = new Date(thirtyDaysAgo);
  prevEnd.setDate(prevEnd.getDate() - 1);

  while (prevCurrent <= prevEnd) {
    const dateStr = formatDateString(prevCurrent);
    const isCompleted = completedDates.has(dateStr);

    if (isCompleted) {
      prevCompletedCount++;
      prevCurrentStreak++;
      prevMaxStreak = Math.max(prevMaxStreak, prevCurrentStreak);
    } else {
      prevCurrentStreak = 0;
    }

    prevDaysCount++;
    prevCurrent.setDate(prevCurrent.getDate() + 1);
  }

  // Calculate previous period score
  const prevCompletionRate =
    prevDaysCount > 0 ? prevCompletedCount / prevDaysCount : 0;
  const prevBaseScore = Math.round(prevCompletionRate * 60);
  const prevStreakBonus = Math.min(25, Math.round((prevMaxStreak / 14) * 25));
  // No recency bonus for previous period
  const previousScore = Math.min(100, prevBaseScore + prevStreakBonus);

  return {
    change: score - previousScore,
    daysIncluded,
    previousScore,
    score,
    sparklineData,
  };
}

/**
 * Calculate weekly comparison data between this week and last week
 *
 * @param tracking - Array of habit tracking entries
 * @param habitCreatedAt - Timestamp when habit was created
 * @returns WeeklyComparisonData with this week vs last week stats
 */
export function calculateWeeklyComparison(
  tracking: HabitTrackingEntry[],
  habitCreatedAt?: number
): {
  thisWeekCompleted: number;
  thisWeekTotal: number;
  lastWeekCompleted: number;
  lastWeekTotal: number;
  difference: number;
  percentChange: number;
  trend: 'up' | 'down' | 'stable';
  thisWeekDays: Array<{
    date: string;
    dayLabel: string;
    completed: boolean;
    isFuture: boolean;
    isBeforeCreation: boolean;
  }>;
  lastWeekDays: Array<{
    date: string;
    dayLabel: string;
    completed: boolean;
    isFuture: boolean;
    isBeforeCreation: boolean;
  }>;
} {
  const today = new Date();
  const todayStr = getTodayString();

  // Get the start of this week (Sunday)
  const thisWeekStart = new Date(today);
  thisWeekStart.setDate(today.getDate() - today.getDay());
  thisWeekStart.setHours(0, 0, 0, 0);

  // Get the start of last week (Sunday)
  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);

  // Create set of completed dates for O(1) lookup
  const completedDates = new Set(
    tracking.filter((t) => t.completed).map((t) => t.date)
  );

  // Day labels
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Generate this week's data
  const thisWeekDays: Array<{
    date: string;
    dayLabel: string;
    completed: boolean;
    isFuture: boolean;
    isBeforeCreation: boolean;
  }> = [];
  let thisWeekCompleted = 0;
  let thisWeekTotal = 0;

  for (let i = 0; i < 7; i++) {
    const day = new Date(thisWeekStart);
    day.setDate(thisWeekStart.getDate() + i);
    const dateStr = formatDateString(day);
    const isFuture = differenceInDays(dateStr, todayStr) > 0;
    const isBeforeCreation = habitCreatedAt
      ? day.getTime() < habitCreatedAt
      : false;

    const completed = completedDates.has(dateStr);

    thisWeekDays.push({
      completed,
      date: dateStr,
      dayLabel: dayLabels[i],
      isBeforeCreation,
      isFuture,
    });

    // Count trackable days and completions
    if (!isFuture && !isBeforeCreation) {
      thisWeekTotal++;
      if (completed) {
        thisWeekCompleted++;
      }
    }
  }

  // Generate last week's data
  const lastWeekDays: Array<{
    date: string;
    dayLabel: string;
    completed: boolean;
    isFuture: boolean;
    isBeforeCreation: boolean;
  }> = [];
  let lastWeekCompleted = 0;
  let lastWeekTotal = 0;

  for (let i = 0; i < 7; i++) {
    const day = new Date(lastWeekStart);
    day.setDate(lastWeekStart.getDate() + i);
    const dateStr = formatDateString(day);
    const isBeforeCreation = habitCreatedAt
      ? day.getTime() < habitCreatedAt
      : false;

    const completed = completedDates.has(dateStr);

    lastWeekDays.push({
      completed,
      date: dateStr,
      dayLabel: dayLabels[i],
      // Last week is never in the future
      isBeforeCreation,
      isFuture: false,
    });

    // Count trackable days and completions
    if (!isBeforeCreation) {
      lastWeekTotal++;
      if (completed) {
        lastWeekCompleted++;
      }
    }
  }

  // Calculate difference and trend
  const difference = thisWeekCompleted - lastWeekCompleted;

  // Calculate percentage change (avoid division by zero)
  let percentChange = 0;
  if (lastWeekCompleted > 0) {
    percentChange = Math.round((difference / lastWeekCompleted) * 100);
  } else if (thisWeekCompleted > 0) {
    percentChange = 100; // From 0 to something is 100% increase
  }

  // Determine trend
  let trend: 'up' | 'down' | 'stable' = 'stable';
  if (difference > 0) {
    trend = 'up';
  } else if (difference < 0) {
    trend = 'down';
  }

  return {
    difference,
    lastWeekCompleted,
    lastWeekDays,
    lastWeekTotal,
    percentChange,
    thisWeekCompleted,
    thisWeekDays,
    thisWeekTotal,
    trend,
  };
}
