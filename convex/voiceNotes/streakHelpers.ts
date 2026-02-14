/**
 * Voice Notes streak helper functions
 *
 * Uses UTC-explicit date parsing to avoid timezone bugs on UTC-based servers.
 */

import { differenceInDays } from '../streakUtils/dateHelpers';

/**
 * Find the date range of the best streak in the completion history
 */
export function findBestStreakPeriod(
  completedDates: string[],
  targetStreakLength: number
): { startDate: string; endDate: string } | null {
  if (completedDates.length === 0) return null;
  if (completedDates.length === 1) {
    return { endDate: completedDates[0], startDate: completedDates[0] };
  }

  let bestStreakStart = completedDates[0];
  let bestStreakEnd = completedDates[0];
  let bestLength = 1;

  let currentStreakStart = completedDates[0];
  let currentLength = 1;

  for (let i = 1; i < completedDates.length; i++) {
    const diffDays = differenceInDays(completedDates[i], completedDates[i - 1]);

    if (diffDays === 1) {
      currentLength++;
      if (currentLength > bestLength) {
        bestLength = currentLength;
        bestStreakStart = currentStreakStart;
        bestStreakEnd = completedDates[i];
      }
    } else if (diffDays > 1) {
      currentStreakStart = completedDates[i];
      currentLength = 1;
    }
  }

  return { endDate: bestStreakEnd, startDate: bestStreakStart };
}
