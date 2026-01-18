/**
 * BinaryHeatmap Animation Utilities
 *
 * Animation timing and delay calculations.
 */

import type { BinaryDay } from './types';

/**
 * Get the total number of cells in the grid (including nulls)
 * Useful for calculating animation delays
 */
export function getTotalCellCount(weeks: (BinaryDay | null)[][]): number {
  return weeks.reduce((total, week) => total + week.length, 0);
}

/**
 * Calculate animation delay for a cell based on its position
 *
 * Animates left-to-right, top-to-bottom.
 * Each column (week) animates slightly after the previous.
 * Within a column, days animate from top (Sunday) to bottom (Saturday).
 */
export function calculateCellAnimationDelay(
  weekIndex: number,
  dayIndex: number,
  staggerDelay: number = 5
): number {
  const linearIndex = weekIndex * 7 + dayIndex;
  return linearIndex * staggerDelay;
}
