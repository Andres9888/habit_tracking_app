/**
 * BinaryHeatmap Grid Statistics
 *
 * Statistics calculation for the binary heatmap grid.
 */

import type { BinaryDay, BinaryGridStats } from './types';

/**
 * Calculate statistics for a binary grid
 */
export function calculateBinaryGridStats(
  weeks: (BinaryDay | null)[][]
): BinaryGridStats {
  let completions = 0;
  let eligibleDays = 0;

  for (const week of weeks) {
    for (const day of week) {
      if (day === null) continue;
      if (day.isBeforeCreation || day.isFuture) continue;
      eligibleDays++;
      if (day.completed) completions++;
    }
  }

  const completionRate =
    eligibleDays > 0 ? Math.round((completions / eligibleDays) * 100) : 0;

  return { completionRate, completions, eligibleDays };
}
