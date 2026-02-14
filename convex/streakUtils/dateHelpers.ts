/**
 * Date calculation helpers for streak tracking
 *
 * All date comparisons use YYYY-MM-DD strings or UTC-explicit parsing
 * to avoid timezone bugs on servers running in UTC (e.g. Convex).
 */

/**
 * Parse a YYYY-MM-DD string to a UTC Date (midnight UTC).
 * Always appends 'Z' to ensure consistent UTC interpretation
 * regardless of server timezone.
 */
function parseUTC(dateStr: string): Date {
  return new Date(dateStr + 'T00:00:00Z');
}

/**
 * Calculate the difference in days between two YYYY-MM-DD date strings.
 * Uses UTC parsing to avoid timezone/DST issues.
 *
 * @param dateStr1 - First date in YYYY-MM-DD format
 * @param dateStr2 - Second date in YYYY-MM-DD format
 * @returns Number of days difference (positive if dateStr1 > dateStr2)
 */
export function differenceInDays(dateStr1: string, dateStr2: string): number {
  const d1 = parseUTC(dateStr1);
  const d2 = parseUTC(dateStr2);
  const diffMs = d1.getTime() - d2.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Calculate the best streak from a list of completed dates
 * @param completedDates - Sorted array of completed dates (descending), YYYY-MM-DD
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
    const diff = differenceInDays(sortedAsc[i], sortedAsc[i - 1]);

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
