/**
 * BinaryHeatmap Calculations
 *
 * Statistics and state calculation utilities for the binary heatmap.
 */

import type {
  BinaryDay,
  BinaryGridStats,
  BinaryCellState,
  TimeRange,
} from '../types';
import { TIME_RANGE_CONFIG } from '../constants';

/**
 * Get the number of days for a given time range
 *
 * @param timeRange - The time range ('3m', '6m', or '1y')
 * @returns Number of days to display
 */
export function getTimeRangeDays(timeRange: TimeRange): number {
  return TIME_RANGE_CONFIG[timeRange].days;
}

/**
 * Determine the cell state based on day properties
 *
 * @param day - The day data
 * @returns Cell state ('beforeCreation', 'future', 'today', 'done', or 'missed')
 *
 * @example
 * const state = getCellState(day);
 * if (state === 'done') {
 *   // Render completed state
 * }
 */
export function getCellState(day: BinaryDay): BinaryCellState {
  if (day.isBeforeCreation) {
    return 'beforeCreation';
  }
  if (day.isFuture) {
    return 'future';
  }
  if (day.isToday) {
    return 'today';
  }
  return day.completed ? 'done' : 'missed';
}

/**
 * Calculate statistics for a binary grid
 *
 * Computes completion rate and counts for a given grid of days.
 * Only counts eligible days (excludes future dates and days before habit creation).
 *
 * @param weeks - The grid weeks array
 * @returns Statistics including completions, eligible days, and completion rate
 *
 * @example
 * const stats = calculateBinaryGridStats(weeks);
 * console.log(`Completion rate: ${stats.completionRate}%`);
 */
export function calculateBinaryGridStats(
  weeks: (BinaryDay | null)[][]
): BinaryGridStats {
  let completions = 0;
  let eligibleDays = 0;

  for (const week of weeks) {
    for (const day of week) {
      // Skip null (padding) cells
      if (day === null) continue;

      // Skip cells that are not eligible (before creation or future)
      if (day.isBeforeCreation || day.isFuture) continue;

      eligibleDays++;
      if (day.completed) {
        completions++;
      }
    }
  }

  const completionRate =
    eligibleDays > 0 ? Math.round((completions / eligibleDays) * 100) : 0;

  return {
    completionRate,
    completions,
    eligibleDays,
  };
}

/**
 * Get the total number of cells in the grid (including nulls)
 *
 * Useful for calculating animation delays or grid dimensions.
 *
 * @param weeks - The grid weeks array
 * @returns Total cell count
 */
export function getTotalCellCount(weeks: (BinaryDay | null)[][]): number {
  return weeks.reduce((total, week) => total + week.length, 0);
}

/**
 * Calculate animation delay for a cell based on its position
 *
 * Animates left-to-right, top-to-bottom (week columns, then days within weeks).
 *
 * @param weekIndex - Index of the week (column)
 * @param dayIndex - Index of the day within the week (row)
 * @param staggerDelay - Base delay between cells in ms (default: 5)
 * @returns Delay in milliseconds
 *
 * @example
 * const delay = calculateCellAnimationDelay(2, 3, 5);
 * // Returns 85 (week 2 * 7 days + day 3 = 17 cells * 5ms)
 */
export function calculateCellAnimationDelay(
  weekIndex: number,
  dayIndex: number,
  staggerDelay: number = 5
): number {
  // Animate left-to-right, top-to-bottom
  // Each column (week) animates slightly after the previous
  // Within a column, days animate from top (Sunday) to bottom (Saturday)
  const linearIndex = weekIndex * 7 + dayIndex;
  return linearIndex * staggerDelay;
}
