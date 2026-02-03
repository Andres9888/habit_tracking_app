/**
 * Streak Calculation Utilities
 *
 * Provides functions for calculating current habit streaks.
 * A "current streak" is the number of consecutive days leading up to
 * (but not beyond) today on which the habit was completed.
 *
 * Key behaviors:
 * - Only counts backwards from today or earlier (ignores future dates)
 * - Single isolated completion counts as 1-day streak
 * - Streak breaks on first missing day
 * - Includes safety limits to prevent infinite loops
 *
 * @module utils/streak
 */

import { format, parseISO } from 'date-fns';

/**
 * Compute the current streak for a habit.
 *
 * Finds the most recent completion date (≤ today) and counts backwards
 * through consecutive completed days until a gap is found.
 *
 * Algorithm:
 * 1. Filter out future dates (> today)
 * 2. Find most recent completion date
 * 3. Count backwards from that date
 * 4. Stop at first gap (missing day)
 *
 * Edge cases:
 * - Empty set: Returns 0
 * - No completions ≤ today: Returns 0
 * - Single completion: Returns 1
 * - Consecutive days: Returns count of consecutive days
 *
 * Safety: Includes 400-day lookback limit to prevent infinite loops
 * (should never be hit in practice for valid habit data).
 *
 * @param completedDates - Set of completion dates in YYYY-MM-DD format
 * @param today - Reference date (typically current date, but configurable for testing)
 * @returns Current streak length in days (≥ 0)
 *
 * @example
 * ```ts
 * const dates = new Set(['2024-01-13', '2024-01-14', '2024-01-15']);
 * const today = new Date('2024-01-15');
 * const streak = computeCurrentStreakFromDates(dates, today); // Returns 3
 * ```
 *
 * @example
 * ```ts
 * // Gap breaks the streak
 * const dates = new Set(['2024-01-10', '2024-01-11', '2024-01-13']); // gap on 12th
 * const today = new Date('2024-01-13');
 * const streak = computeCurrentStreakFromDates(dates, today); // Returns 1
 * ```
 */
export const computeCurrentStreakFromDates = (
  completedDates: Set<string>,
  today: Date
): number => {
  if (!completedDates || completedDates.size === 0) {
    return 0;
  }

  const todayString = format(new Date(today), 'yyyy-MM-dd');

  // Find the most recent completed date that is not in the future
  const latestCompleted = [...completedDates]
    .filter((date) => date <= todayString)
    .sort()
    .pop();

  if (!latestCompleted) {
    return 0;
  }

  let streak = 0;
  const currentDate = parseISO(latestCompleted);

  // Count consecutive days backward from the latest completion
  // Stop when a gap is found
  // Safety guard to avoid unexpected infinite loops
  const maxLookbackDays = 400; // > 1 year
  for (let i = 0; i < maxLookbackDays; i++) {
    const dateString = format(currentDate, 'yyyy-MM-dd');
    if (completedDates.has(dateString)) {
      streak += 1;
      currentDate.setDate(currentDate.getDate() - 1);
      continue;
    }
    break;
  }

  return streak;
};
