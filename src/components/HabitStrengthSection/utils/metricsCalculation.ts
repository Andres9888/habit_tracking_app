/**
 * Extended Metrics Calculation
 *
 * Calculate comprehensive strength metrics for the HabitStrengthSection.
 */

import type { StrengthSnapshot } from '../../HabitStrengthHistory/types';
import { getStrengthLabel } from '../../HabitStrengthHistory/strengthUtils';
import type { TimeRange, ExtendedStrengthMetrics } from '../types';
import { filterHistoryByTimeRange } from './historyFilters';
import { calculateMonthDelta } from './deltaCalculations';

/**
 * Calculate extended metrics for the HabitStrengthSection.
 *
 * @param completedDates - Set of completed dates
 * @param habitCreatedAt - Habit creation timestamp (ms)
 * @param currentStrength - Current strength value (from database or calculated)
 * @param strengthHistory - Full strength history
 * @param timeRange - Selected time range
 * @returns Extended metrics object
 */
export function calculateExtendedMetrics(
  completedDates: Set<string>,
  habitCreatedAt: number,
  currentStrength: number,
  strengthHistory: StrengthSnapshot[],
  timeRange: TimeRange
): ExtendedStrengthMetrics {
  const safeCreatedAt =
    typeof habitCreatedAt === 'number' && !Number.isNaN(habitCreatedAt) && habitCreatedAt > 0
      ? habitCreatedAt
      : Date.now();
  const createdAtDate = new Date(safeCreatedAt);

  const deltaVsMonth = calculateMonthDelta(
    completedDates,
    createdAtDate,
    currentStrength
  );

  const filteredHistory = filterHistoryByTimeRange(strengthHistory, timeRange);
  const label = getStrengthLabel(currentStrength);

  return {
    current: Math.round(currentStrength),
    deltaVsMonth,
    label,
    strengthHistory: filteredHistory,
  };
}
