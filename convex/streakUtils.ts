/**
 * Streak Tracking Utilities (Story 1.3)
 * Handles calculation and updating of habit streaks
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

export interface StreakData {
  currentStreak: number;
  bestStreak: number;
  lastCompletedDate: string;
}

/**
 * Calculate streak from full tracking history
 * This is more accurate than incremental updates, especially for backfills
 * @param tracking - Array of tracking records with date and completed status
 * @param todayDate - Today's date in YYYY-MM-DD format
 * @returns Streak data calculated from history
 */
export function calculateStreakFromHistory(
  tracking: Array<{ date: string; completed: boolean }>,
  todayDate: string
): StreakData {
  // Filter to only completed dates and sort descending (most recent first)
  const completedDates = tracking
    .filter((t) => t.completed)
    .map((t) => t.date)
    .sort((a, b) => b.localeCompare(a));

  if (completedDates.length === 0) {
    return {
      bestStreak: 0,
      currentStreak: 0,
      lastCompletedDate: '',
    };
  }

  const lastCompletedDate = completedDates[0];

  // Calculate current streak - count consecutive days from today backwards
  // The streak is valid if completed today OR yesterday (grace period)
  const today = new Date(todayDate + 'T00:00:00');
  const lastCompleted = new Date(lastCompletedDate + 'T00:00:00');
  const daysSinceLastCompletion = differenceInDays(today, lastCompleted);

  // If last completion was more than 1 day ago, streak is broken
  if (daysSinceLastCompletion > 1) {
    // Streak is broken, but we still calculate best streak from history
    const bestStreak = calculateBestStreakFromDates(completedDates);
    return {
      bestStreak,
      currentStreak: 0,
      lastCompletedDate,
    };
  }

  // Count consecutive days backwards from the last completed date
  let currentStreak = 1;
  let checkDate = lastCompletedDate;

  for (let i = 1; i < completedDates.length; i++) {
    const prevDate = completedDates[i];
    const checkDateObj = new Date(checkDate + 'T00:00:00');
    const prevDateObj = new Date(prevDate + 'T00:00:00');
    const diff = differenceInDays(checkDateObj, prevDateObj);

    if (diff === 1) {
      // Consecutive day
      currentStreak++;
      checkDate = prevDate;
    } else if (diff === 0) {
      // Same day (shouldn't happen with unique dates, but handle it)
      continue;
    } else {
      // Gap found, stop counting
      break;
    }
  }

  const bestStreak = calculateBestStreakFromDates(completedDates);

  return {
    bestStreak: Math.max(bestStreak, currentStreak),
    currentStreak,
    lastCompletedDate,
  };
}

/**
 * Calculate the best streak from a list of completed dates
 * @param completedDates - Sorted array of completed dates (descending)
 * @returns The longest streak found
 */
function calculateBestStreakFromDates(completedDates: string[]): number {
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

/**
 * Update streak based on habit completion (legacy - kept for reference)
 * @deprecated Use calculateStreakFromHistory instead for accurate backfill support
 */
export function updateStreak(
  currentData: {
    currentStreak?: number;
    bestStreak?: number;
    lastCompletedDate?: string;
  },
  completionDate: string,
  isCompleting: boolean
): StreakData {
  const currentStreak = currentData.currentStreak ?? 0;
  const bestStreak = currentData.bestStreak ?? 0;
  const lastCompletedDate = currentData.lastCompletedDate;

  // If uncompleting, we need different logic
  if (!isCompleting) {
    // When uncompleting, we can't reliably recalculate without full history
    // So we just clear the lastCompletedDate if it matches
    if (lastCompletedDate === completionDate) {
      return {
        bestStreak,
        currentStreak: 0,
        lastCompletedDate: '',
      };
    }
    // If it's not the last completed date, just return current values
    return {
      bestStreak,
      currentStreak,
      lastCompletedDate: lastCompletedDate ?? '',
    };
  }

  // Completing a habit
  const completionDateObj = new Date(completionDate + 'T00:00:00');

  // First completion ever
  if (!lastCompletedDate) {
    return {
      bestStreak: Math.max(1, bestStreak),
      currentStreak: 1,
      lastCompletedDate: completionDate,
    };
  }

  const lastDateObj = new Date(lastCompletedDate + 'T00:00:00');
  const daysDiff = differenceInDays(completionDateObj, lastDateObj);

  let newCurrentStreak: number;

  if (daysDiff === 0) {
    // Same day completion - no change to streak
    newCurrentStreak = currentStreak;
  } else if (daysDiff === 1) {
    // Consecutive day - increment streak
    newCurrentStreak = currentStreak + 1;
  } else if (daysDiff > 1) {
    // Gap detected - reset streak to 1
    newCurrentStreak = 1;
  } else {
    // daysDiff < 0 means completing a past date before lastCompletedDate
    // This is a backfill scenario - don't update streak
    return {
      bestStreak,
      currentStreak,
      lastCompletedDate,
    };
  }

  // Update best streak if current exceeds it
  const newBestStreak = Math.max(newCurrentStreak, bestStreak);

  return {
    bestStreak: newBestStreak,
    currentStreak: newCurrentStreak,
    lastCompletedDate: completionDate,
  };
}
