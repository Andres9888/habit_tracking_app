/**
 * Helper functions for WeeklyPatternChart
 */

/**
 * Find the best performing day from stats with data
 */
export function findBestDay(
  withData: Array<{ dayIndex: number; rate: number }>
): { dayIndex: number; rate: number } | undefined {
  let best: { dayIndex: number; rate: number } | undefined;
  for (const day of withData) {
    if (!best || day.rate > best.rate) {
      best = day;
    }
  }
  return best;
}

/**
 * Find the worst performing day from stats with data
 */
export function findWorstDay(
  withData: Array<{ dayIndex: number; rate: number }>
): { dayIndex: number; rate: number } | undefined {
  let worst: { dayIndex: number; rate: number } | undefined;
  for (const day of withData) {
    if (!worst || day.rate < worst.rate) {
      worst = day;
    }
  }
  return worst;
}
