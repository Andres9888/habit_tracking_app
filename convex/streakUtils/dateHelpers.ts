/**
 * Date calculation helpers for streak tracking
 */

/**
 * Calculate the difference in days between two dates
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Number of days difference
 */
export function differenceInDays(date1: Date, date2: Date): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  // Normalize to midnight
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);

  const diffMs = d1.getTime() - d2.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Get the day of the week from a date string
 * @param dateString - Date in YYYY-MM-DD format
 * @returns Day of week (0 = Sunday, 6 = Saturday)
 */
export function getDayOfWeek(dateString: string): number {
  const date = new Date(dateString + 'T00:00:00');
  return date.getDay();
}

/**
 * Calculate the best streak from a list of completed dates
 * @param completedDates - Sorted array of completed dates (descending)
 * @returns The longest streak found
 */
export function calculateBestStreakFromDates(completedDates: string[]): number {
  if (completedDates.length === 0) return 0;
  if (completedDates.length === 1) return 1;

  // Sort ascending for easier streak counting
  const sortedAsc = [...completedDates].sort((a, b) => a.localeCompare(b));

  let bestStreak = 1;
  let currentRun = 1;

  for (let i = 1; i < sortedAsc.length; i++) {
    const prevDate = new Date(sortedAsc[i - 1] + 'T00:00:00');
    const currDate = new Date(sortedAsc[i] + 'T00:00:00');
    const diff = differenceInDays(currDate, prevDate);

    if (diff === 1) {
      currentRun++;
      bestStreak = Math.max(bestStreak, currentRun);
    } else if (diff > 1) {
      currentRun = 1;
    }
    // diff === 0 means duplicate date, skip
  }

  return bestStreak;
}
