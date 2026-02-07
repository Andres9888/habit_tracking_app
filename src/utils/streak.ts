import { format, parseISO } from 'date-fns';

/**
 * Compute a streak by starting at the most recent completed day (<= today)
 * and counting backwards through consecutive completed days.
 * Returns 0 if the most recent completion is more than 1 day ago (streak broken).
 *
 * @param completedDates - Array of date strings sorted descending (newest first).
 *   The caller is responsible for maintaining sort order.
 * @param today - Reference date for streak calculation
 */
export const computeCurrentStreakFromDates = (
  completedDates: string[],
  today: Date
): number => {
  if (!completedDates || completedDates.length === 0) {
    return 0;
  }

  const todayString = format(new Date(today), 'yyyy-MM-dd');

  // Find the most recent completed date that is not in the future.
  // Array is sorted descending, so scan from front for first date <= today.
  let latestCompleted: string | undefined;
  for (const date of completedDates) {
    if (date <= todayString) {
      latestCompleted = date;
      break;
    }
  }

  if (!latestCompleted) {
    return 0;
  }

  // A streak is only "current" if the most recent completion was today or yesterday.
  // If the gap is larger, the streak is broken regardless of past consecutive days.
  const latestDate = parseISO(latestCompleted);
  const todayDate = new Date(today);
  todayDate.setHours(0, 0, 0, 0);
  latestDate.setHours(0, 0, 0, 0);
  const msDiff = todayDate.getTime() - latestDate.getTime();
  const daysSinceLastCompletion = Math.floor(msDiff / (1000 * 60 * 60 * 24));

  if (daysSinceLastCompletion > 1) {
    return 0;
  }

  // Build a Set for O(1) lookups during the backward-counting loop
  const dateSet = new Set(completedDates);

  let streak = 0;
  const currentDate = parseISO(latestCompleted);

  // Count consecutive days backward from the latest completion
  // Safety guard to avoid unexpected infinite loops
  const maxLookbackDays = 400; // > 1 year
  for (let i = 0; i < maxLookbackDays; i++) {
    const dateString = format(currentDate, 'yyyy-MM-dd');
    if (dateSet.has(dateString)) {
      streak += 1;
      currentDate.setDate(currentDate.getDate() - 1);
      continue;
    }
    break;
  }

  return streak;
};
