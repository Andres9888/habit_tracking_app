/**
 * Utility functions for finding best and worst performing days
 */

import type { DayStats } from '../InsightsSection.types';

/**
 * Find the best performing day (highest completion rate)
 */
export function findBestDay(dayStats: DayStats[]): DayStats | null {
  const withData = dayStats.filter((d) => d.total > 0);
  if (withData.length === 0) return null;

  let best = withData[0];
  for (const day of withData) {
    if (day.rate > best.rate) {
      best = day;
    }
  }
  return best;
}

/**
 * Find the worst performing day (lowest completion rate)
 */
export function findWorstDay(dayStats: DayStats[]): DayStats | null {
  const withData = dayStats.filter((d) => d.total > 0);
  if (withData.length === 0) return null;

  let worst = withData[0];
  for (const day of withData) {
    if (day.rate < worst.rate) {
      worst = day;
    }
  }
  return worst;
}
