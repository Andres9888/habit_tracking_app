/**
 * Voice Notes streak helper functions
 */

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
    const prevDate = new Date(completedDates[i - 1] + 'T00:00:00');
    const currDate = new Date(completedDates[i] + 'T00:00:00');
    const diffDays = Math.floor(
      (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
    );

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
