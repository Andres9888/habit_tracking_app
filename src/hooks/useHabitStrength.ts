/**
 * useHabitStrength Hook
 *
 * Calculates habit strength using exponential smoothing algorithm.
 * Returns current strength, historical timeline, and comparison metrics.
 *
 * The algorithm is based on Loop Habit Tracker:
 * - Growth on completion: strength + (1 - strength) * 0.05
 * - Decay on miss: strength * 0.95
 * - Reaches ~100% after ~60-90 days of perfect consistency
 *
 * @example
 * ```tsx
 * const { currentStrength, strengthHistory, metrics, isCalculating } = useHabitStrength(
 *   completedDates,
 *   habitCreatedAt
 * );
 *
 * // Display current strength
 * <Text>{currentStrength}%</Text>
 *
 * // Chart the history
 * <StrengthTimelineChart data={strengthHistory} />
 *
 * // Show comparison metrics
 * <Text>Peak: {metrics.peak}%</Text>
 * ```
 *
 * @see habit-strength-history-spec.md Section 3 for algorithm details
 */

import { useMemo } from 'react';

import { differenceInDays, startOfDay, subDays, subYears } from 'date-fns';

import type {
  StrengthMetrics,
  UseHabitStrengthReturn,
} from '../components/HabitStrengthHistory/types';
import {
  calculateDelta,
  calculateStrengthAtDate,
  calculateStrengthExtremes,
  generateStrengthTimeline,
} from '../components/HabitStrengthHistory/strengthUtils';

/**
 * Hook to calculate habit strength metrics and history.
 *
 * Uses memoization keyed on completedDates.size and habitCreatedAt
 * to avoid expensive recalculations on every render.
 *
 * @param completedDates - Set of completed dates in YYYY-MM-DD format
 * @param habitCreatedAt - Timestamp when the habit was created (ms since epoch)
 * @returns Object with currentStrength, strengthHistory, metrics, and isCalculating
 */
export function useHabitStrength(
  completedDates: Set<string>,
  habitCreatedAt: number
): UseHabitStrengthReturn {
  // Memoize the entire calculation based on inputs
  // Key insight: We use completedDates.size as a proxy for content changes
  // This works because the Set is typically recreated when entries change
  const result = useMemo(() => {
    // Defensive check for invalid habitCreatedAt
    const safeCreatedAt =
      typeof habitCreatedAt === 'number' &&
      !Number.isNaN(habitCreatedAt) &&
      habitCreatedAt > 0
        ? habitCreatedAt
        : Date.now();
    const createdAtDate = new Date(safeCreatedAt);
    const today = startOfDay(new Date());
    const habitAgeDays = differenceInDays(today, startOfDay(createdAtDate)) + 1;

    // Generate the full strength timeline
    const strengthHistory = generateStrengthTimeline(
      completedDates,
      createdAtDate
    );

    // Current strength is the last value in the timeline
    const currentStrength =
      strengthHistory.length > 0 ? (strengthHistory.at(-1)?.strength ?? 0) : 0;

    // Calculate strength at 30 days ago (if habit is old enough)
    const thirtyDaysAgo = subDays(today, 30);
    const thirtyDaysAgoStrength =
      habitAgeDays > 30
        ? calculateStrengthAtDate(completedDates, createdAtDate, thirtyDaysAgo)
        : null;

    // Calculate strength at 1 year ago (if habit is old enough)
    const oneYearAgo = subYears(today, 1);
    const oneYearAgoStrength =
      habitAgeDays > 365
        ? calculateStrengthAtDate(completedDates, createdAtDate, oneYearAgo)
        : null;

    // Calculate peak and lowest from history
    const { peak, lowest } = calculateStrengthExtremes(strengthHistory);

    // Calculate delta vs 30 days ago
    const deltaVsMonth =
      thirtyDaysAgoStrength === null
        ? currentStrength
        : calculateDelta(currentStrength, thirtyDaysAgoStrength); // If habit < 30 days, delta is the current value

    const metrics: StrengthMetrics = {
      current: currentStrength,
      deltaVsMonth,
      habitAgeDays,
      lowest: lowest.strength,
      lowestDate: lowest.date,
      oneYearAgo: oneYearAgoStrength,
      peak: peak.strength,
      peakDate: peak.date,
      thirtyDaysAgo: thirtyDaysAgoStrength,
    };

    return {
      currentStrength,
      isCalculating: false,
      metrics,
      strengthHistory,
    };
  }, [completedDates, habitCreatedAt]);

  return result;
}

export default useHabitStrength;
