/**
 * Day of Week Statistics Utilities
 */

/**
 * Calculates day of week stats from completion dates
 */
export function calculateDayOfWeekStats(
  completionDates: string[]
): Record<number, number> {
  const stats: Record<number, number> = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  };

  completionDates.forEach((dateStr) => {
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay();
    stats[dayOfWeek]++;
  });

  return stats;
}

/**
 * Gets best and worst days of the week
 */
export function findBestWorstDays(completionDates: string[]) {
  const stats = calculateDayOfWeekStats(completionDates);

  let bestDay = 0;
  let worstDay = 0;
  let bestCount = stats[0];
  let worstCount = stats[0];

  for (let day = 1; day < 7; day++) {
    if (stats[day] > bestCount) {
      bestDay = day;
      bestCount = stats[day];
    }
    if (stats[day] < worstCount) {
      worstDay = day;
      worstCount = stats[day];
    }
  }

  return {
    bestDay,
    worstDay,
    bestCount,
    worstCount,
  };
}

/**
 * Calculates completion rate for a period
 */
export function calculateCompletionRate(
  completionDates: string[],
  totalDays: number
): number {
  if (totalDays === 0) return 0;
  const uniqueDates = new Set(
    completionDates.map((d) => {
      return new Date(d).toISOString().split('T')[0];
    })
  );
  return Math.round((uniqueDates.size / totalDays) * 100);
}
