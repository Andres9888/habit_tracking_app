import { format, parseISO } from 'date-fns';
import { STREAK_MAX_LOOKBACK_DAYS } from '@/constants';

/**
 * Compute a streak by starting at the most recent completed day (<= today)
 * and counting backwards through consecutive completed days.
 * Ensures a single isolated completion counts as a 1-day streak.
 *
 * The streak is only "current" if the most recent completion is today or
 * yesterday (1-day grace period, matching the server-side calculation).
 * Without this check, a streak that ended days ago would still display
 * its full length on the client while the server reports 0.
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

  // Check that the streak is still active: last completion must be today or
  // yesterday. This matches the server-side calculateStreakFromHistory which
  // returns currentStreak=0 when daysSinceLastCompletion > 1.
  const latestDate = parseISO(latestCompleted);
  const todayDate = parseISO(todayString);
  const msDiff = todayDate.getTime() - latestDate.getTime();
  const daysSinceLastCompletion = Math.round(msDiff / (1000 * 60 * 60 * 24));

  if (daysSinceLastCompletion > 1) {
    return 0;
  }

  let streak = 0;
  const currentDate = parseISO(latestCompleted);

  // Count consecutive days backward from the latest completion
  // Stop when a gap is found
  // Safety guard to avoid unexpected infinite loops
  const maxLookbackDays = STREAK_MAX_LOOKBACK_DAYS;
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


