/**
 * Legacy streak update function
 * @deprecated Use calculateStreakFromHistory instead for accurate backfill support
 */

import { differenceInDays } from './dateHelpers';
import type { StreakData } from './types';

/**
 * Update streak based on habit completion (legacy)
 * @deprecated Use calculateStreakFromHistory instead for accurate backfill support
 *
 * All date comparisons use YYYY-MM-DD strings via differenceInDays (UTC-safe).
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
    if (lastCompletedDate === completionDate) {
      return {
        bestStreak,
        currentStreak: 0,
        lastCompletedDate: '',
      };
    }
    return {
      bestStreak,
      currentStreak,
      lastCompletedDate: lastCompletedDate ?? '',
    };
  }

  // First completion ever
  if (!lastCompletedDate) {
    return {
      bestStreak: Math.max(1, bestStreak),
      currentStreak: 1,
      lastCompletedDate: completionDate,
    };
  }

  // Compare YYYY-MM-DD strings via UTC-safe differenceInDays
  const daysDiff = differenceInDays(completionDate, lastCompletedDate);

  let newCurrentStreak: number;

  if (daysDiff === 0) {
    newCurrentStreak = currentStreak;
  } else if (daysDiff === 1) {
    newCurrentStreak = currentStreak + 1;
  } else if (daysDiff > 1) {
    newCurrentStreak = 1;
  } else {
    // Backfill scenario - don't update streak
    return {
      bestStreak,
      currentStreak,
      lastCompletedDate,
    };
  }

  const newBestStreak = Math.max(newCurrentStreak, bestStreak);

  return {
    bestStreak: newBestStreak,
    currentStreak: newCurrentStreak,
    lastCompletedDate: completionDate,
  };
}
