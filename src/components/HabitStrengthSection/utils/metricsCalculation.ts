/**
 * Extended Metrics Calculation
 *
 * Calculate comprehensive strength metrics for the HabitStrengthSection.
 */

import type { StrengthSnapshot } from '../../HabitStrengthHistory/types';
import {
  calculateStrengthExtremes,
  getStrengthLabel,
} from '../../HabitStrengthHistory/strengthUtils';
import { getProgressToNextLevel } from '../../ProgressSectionConsolidated/types/levelHelpers';
import type { TimeRange, ExtendedStrengthMetrics } from '../types';
import { filterHistoryByTimeRange } from './historyFilters';
import { calculateWeekDelta, calculateMonthDelta } from './deltaCalculations';

/**
 * Calculate extended metrics for the HabitStrengthSection.
 *
 * @param completedDates - Set of completed dates
 * @param habitCreatedAt - Habit creation timestamp (ms)
 * @param currentStrength - Current strength value (from database or calculated)
 * @param _deltaVsMonth - Deprecated: Month-over-month delta (now calculated internally)
 * @param strengthHistory - Full strength history
 * @param timeRange - Selected time range
 * @returns Extended metrics object
 */
export function calculateExtendedMetrics(
  completedDates: Set<string>,
  habitCreatedAt: number,
  currentStrength: number,
  _deltaVsMonth: number, // Ignored - we calculate this ourselves now
  strengthHistory: StrengthSnapshot[],
  timeRange: TimeRange
): ExtendedStrengthMetrics {
  // Guard against invalid habitCreatedAt - use current time as fallback
  const safeCreatedAt = typeof habitCreatedAt === 'number' && !Number.isNaN(habitCreatedAt) && habitCreatedAt > 0
    ? habitCreatedAt
    : Date.now();
  const createdAtDate = new Date(safeCreatedAt);

  // Calculate week delta using current strength (from database)
  const deltaVsWeek = calculateWeekDelta(
    completedDates,
    createdAtDate,
    currentStrength
  );

  // Calculate month delta using current strength (from database)
  // This ensures consistency when habitStrength is passed from the database
  const deltaVsMonth = calculateMonthDelta(
    completedDates,
    createdAtDate,
    currentStrength
  );

  // Filter history by time range
  const filteredHistory = filterHistoryByTimeRange(strengthHistory, timeRange);

  const { peak } = calculateStrengthExtremes(strengthHistory);
  const { nextLevel, pointsToNext } = getProgressToNextLevel(currentStrength);
  const label = getStrengthLabel(currentStrength);

  return {
    current: Math.round(currentStrength),
    deltaVsMonth,
    deltaVsWeek,
    label,
    nextTierLabel: nextLevel?.label ?? null,
    nextTierThreshold: nextLevel?.min ?? null,
    peak: Math.round(peak.strength),
    pointsToNextTier: Math.max(0, Math.round(pointsToNext)),
    sinceStart: Math.round(currentStrength),
    strengthHistory: filteredHistory,
  };
}
