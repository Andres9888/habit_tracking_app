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
      ? new Date(tracking[tracking.length - 1].date)
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
    day,
    dayIndex: index,
    completed: dayStats[index].completed,
    total: dayStats[index].total,
    rate:
      dayStats[index].total > 0
        ? Math.round((dayStats[index].completed / dayStats[index].total) * 100)
        : 0,
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
          startDate: streakStart,
          endDate: prevDateStr,
          isCurrent: false,
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
    const lastDate = completedDates[completedDates.length - 1];
    // Check if last date is today or yesterday (streak is still active)
    const daysSinceLastCompletion = differenceInDays(today, lastDate);
    const isCurrent = daysSinceLastCompletion <= 1;

    streaks.push({
      days: streakDays,
      startDate: streakStart,
      endDate: lastDate,
      isCurrent: isCurrent && currentStreak > 0,
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
        startDate: formatDateString(startDate),
        endDate: today,
        isCurrent: true,
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
    thisMonth: thisMonthRate,
    lastMonth: lastMonthRate,
    change: thisMonthRate - lastMonthRate,
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

  const bestDay = withData.reduce((best, curr) =>
    curr.rate > best.rate ? curr : best
  );

  const worstDay = withData.reduce((worst, curr) =>
    curr.rate < worst.rate ? curr : worst
  );

  return { bestDay, worstDay };
}
