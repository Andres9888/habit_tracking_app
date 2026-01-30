/**
 * History Filtering Utilities
 *
 * Functions for filtering and sampling strength history data.
 */

import { subDays, startOfDay } from 'date-fns';

import type { StrengthSnapshot } from '../../HabitStrengthHistory/types';
import type { TimeRange } from '../types';
import { TIME_RANGE_DAYS } from '../constants';

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
  if (!history || history.length === 0) {
    return [];
  }

  const days = TIME_RANGE_DAYS[timeRange];
  const cutoffDate = startOfDay(subDays(new Date(), days));

  return history.filter((snapshot) => {
    // Guard against invalid snapshots or dates
    if (!snapshot || !snapshot.date) return false;
    return snapshot.date >= cutoffDate;
  });
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
  if (!history || history.length === 0) {
    return [];
  }
  if (history.length <= maxPoints) {
    return history;
  }

  const result: StrengthSnapshot[] = [];
  const step = (history.length - 1) / (maxPoints - 1);

  for (let i = 0; i < maxPoints; i++) {
    const index = Math.min(Math.round(i * step), history.length - 1);
    const snapshot = history[index];
    // Guard against undefined entries
    if (snapshot) {
      result.push(snapshot);
    }
  }

  return result;
}
