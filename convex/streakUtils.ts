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
 * Update streak based on habit completion
 * @param currentData - Current streak data from habit
 * @param completionDate - Date of completion (YYYY-MM-DD format)
 * @param isCompleting - true if completing, false if uncompleting
 * @returns Updated streak data
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
        currentStreak: 0,
        bestStreak,
        lastCompletedDate: '',
      };
    }
    // If it's not the last completed date, just return current values
    return {
      currentStreak,
      bestStreak,
      lastCompletedDate: lastCompletedDate ?? '',
    };
  }

  // Completing a habit
  const completionDateObj = new Date(completionDate + 'T00:00:00');

  // First completion ever
  if (!lastCompletedDate) {
    return {
      currentStreak: 1,
      bestStreak: Math.max(1, bestStreak),
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
      currentStreak,
      bestStreak,
      lastCompletedDate,
    };
  }

  // Update best streak if current exceeds it
  const newBestStreak = Math.max(newCurrentStreak, bestStreak);

  return {
    currentStreak: newCurrentStreak,
    bestStreak: newBestStreak,
    lastCompletedDate: completionDate,
  };
}
