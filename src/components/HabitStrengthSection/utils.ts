/**
 * Habit Strength Section - Utility Functions
 *
 * Data transformation helpers for the HabitStrengthSection component.
 */

import { subDays, startOfDay, addDays, differenceInDays, format } from 'date-fns';

import type { StrengthSnapshot, StrengthLabel } from '../HabitStrengthHistory/types';
import {
  calculateStrengthAtDate,
  getStrengthLabel,
} from '../HabitStrengthHistory/strengthUtils';
import type { TimeRange, ExtendedStrengthMetrics } from './types';
import { TIME_RANGE_DAYS } from './constants';

/**
 * Filter strength history based on time range selection.
 *
 * @param history - Full strength history array
 * @param timeRange - Selected time range (1m/1y/all)
 * @returns Filtered history array
 */
export function filterHistoryByTimeRange(
  history: StrengthSnapshot[],
  timeRange: TimeRange
): StrengthSnapshot[] {
  if (timeRange === 'all' || history.length === 0) {
    return history;
  }

  const days = TIME_RANGE_DAYS[timeRange];
  const cutoffDate = startOfDay(subDays(new Date(), days));

  return history.filter((snapshot) => snapshot.date >= cutoffDate);
}

/**
 * Calculate week-over-week delta.
 *
 * @param completedDates - Set of completed dates
 * @param habitCreatedAt - Habit creation date
 * @param currentStrength - Current strength value
 * @returns Week-over-week change
 */
export function calculateWeekDelta(
  completedDates: Set<string>,
  habitCreatedAt: Date,
  currentStrength: number
): number {
  const today = startOfDay(new Date());
  const oneWeekAgo = subDays(today, 7);

  // If habit is less than 7 days old, return current strength as delta
  if (oneWeekAgo < startOfDay(habitCreatedAt)) {
    return currentStrength;
  }

  const weekAgoStrength = calculateStrengthAtDate(
    completedDates,
    habitCreatedAt,
    oneWeekAgo
  );

  // Round to integer to match displayed values
  return Math.round(currentStrength - weekAgoStrength);
}

/**
 * Calculate extended metrics for the HabitStrengthSection.
 *
 * @param completedDates - Set of completed dates
 * @param habitCreatedAt - Habit creation timestamp (ms)
 * @param currentStrength - Current strength value
 * @param deltaVsMonth - Month-over-month delta
 * @param strengthHistory - Full strength history
 * @param timeRange - Selected time range
 * @returns Extended metrics object
 */
export function calculateExtendedMetrics(
  completedDates: Set<string>,
  habitCreatedAt: number,
  currentStrength: number,
  deltaVsMonth: number,
  strengthHistory: StrengthSnapshot[],
  timeRange: TimeRange
): ExtendedStrengthMetrics {
  const createdAtDate = new Date(habitCreatedAt);

  // Calculate week delta
  const deltaVsWeek = calculateWeekDelta(
    completedDates,
    createdAtDate,
    currentStrength
  );

  // Filter history by time range
  const filteredHistory = filterHistoryByTimeRange(strengthHistory, timeRange);

  // Get strength label
  const label = getStrengthLabel(currentStrength);

  return {
    current: Math.round(currentStrength),
    label,
    deltaVsMonth: Math.round(deltaVsMonth),
    deltaVsWeek,
    sinceStart: Math.round(currentStrength), // Since start = current (started at 0)
    strengthHistory: filteredHistory,
  };
}

/**
 * Sample strength history for chart display.
 * Reduces data points while preserving shape for performance.
 *
 * @param history - Strength history array
 * @param maxPoints - Maximum number of points to return
 * @returns Sampled history array
 */
export function sampleHistoryForChart(
  history: StrengthSnapshot[],
  maxPoints: number = 50
): StrengthSnapshot[] {
  if (history.length <= maxPoints) {
    return history;
  }

  const result: StrengthSnapshot[] = [];
  const step = (history.length - 1) / (maxPoints - 1);

  for (let i = 0; i < maxPoints; i++) {
    const index = Math.round(i * step);
    result.push(history[index]);
  }

  return result;
}

/** Exponential smoothing constants (matches Loop Habit Tracker) */
const GROWTH_RATE = 0.05; // +5% of remaining on completion
const DECAY_RATE = 0.95;  // -5% on miss

/**
 * Generate strength history directly from completedDates.
 *
 * This bypasses the useHabitStrength hook which may have incorrect
 * habitCreatedAt timestamps. Instead, we find the earliest completion
 * date and simulate the exponential smoothing algorithm from there.
 *
 * @param completedDates - Set of completion dates (YYYY-MM-DD format)
 * @param timeRange - Time range filter (1m/1y/all)
 * @returns Array of StrengthSnapshot for charting
 */
export function generateChartDataFromCompletions(
  completedDates: Set<string>,
  timeRange: TimeRange
): StrengthSnapshot[] {
  if (completedDates.size === 0) {
    return [];
  }

  // Find the earliest completion date
  const sortedDates = Array.from(completedDates).sort();
  const earliestDate = startOfDay(new Date(sortedDates[0]));
  const today = startOfDay(new Date());

  // Apply time range filter to start date
  const days = TIME_RANGE_DAYS[timeRange];
  const timeRangeStart = days === Infinity
    ? earliestDate
    : startOfDay(subDays(today, days));

  // Use the later of earliest completion or time range start
  const chartStartDate = timeRangeStart > earliestDate ? timeRangeStart : earliestDate;

  // We need to calculate strength from the very beginning to get accurate values
  // even if we only display from chartStartDate
  const totalDays = differenceInDays(today, earliestDate) + 1;

  // Generate full history from earliest date
  const fullHistory: StrengthSnapshot[] = [];
  let strength = 0;
  let currentDate = earliestDate;

  for (let i = 0; i < totalDays; i++) {
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    const wasCompleted = completedDates.has(dateStr);

    // Apply exponential smoothing
    if (wasCompleted) {
      strength = strength + (1 - strength) * GROWTH_RATE;
    } else {
      strength = strength * DECAY_RATE;
    }

    // Convert to percentage (0-100)
    const strengthPercent = Math.round(strength * 1000) / 10;

    // Only include in result if on or after chart start date
    if (currentDate >= chartStartDate) {
      fullHistory.push({
        date: new Date(currentDate),
        dateString: dateStr,
        strength: strengthPercent,
        label: getStrengthLabel(strengthPercent),
      });
    }

    currentDate = addDays(currentDate, 1);
  }

  return fullHistory;
}
