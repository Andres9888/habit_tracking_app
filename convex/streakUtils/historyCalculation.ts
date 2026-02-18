/**
 * Calculate streak from full tracking history
 */

import { calculateBestStreakFromDates, differenceInDays } from './dateHelpers';
import type { StreakData, TrackingRecord } from './types';

/**
 * Optional pause information for streak calculation
 */
export interface PauseInfo {
  pausedAt?: number;
  resumedAt?: number;
}

/**
 * Check if a date falls within a pause period
 */
function isDateInPausePeriod(date: string, pauseInfo?: PauseInfo): boolean {
  if (!pauseInfo?.pausedAt) return false;
  
  const dateMs = new Date(date + 'T00:00:00').getTime();
  const pausedAtMs = pauseInfo.pausedAt;
  const resumedAtMs = pauseInfo.resumedAt;
  
  // If paused and not yet resumed, check if date is after pausedAt
  if (pausedAtMs && !resumedAtMs) {
    return dateMs >= pausedAtMs;
  }
  
  // If paused and resumed, check if date is within pause period
  if (pausedAtMs && resumedAtMs) {
    return dateMs >= pausedAtMs && dateMs < resumedAtMs;
  }
  
  return false;
}

/**
 * Calculate streak from full tracking history
 * This is more accurate than incremental updates, especially for backfills
 * @param tracking - Array of tracking records with date and completed status
 * @param todayDate - Today's date in YYYY-MM-DD format
 * @param pauseInfo - Optional pause information to exclude paused periods from streak
 * @returns Streak data calculated from history
 */
export function calculateStreakFromHistory(
  tracking: TrackingRecord[],
  todayDate: string,
  pauseInfo?: PauseInfo
): StreakData {
  // Filter out tracking entries during pause periods
  const filteredTracking = pauseInfo?.pausedAt
    ? tracking.filter((t) => !isDateInPausePeriod(t.date, pauseInfo))
    : tracking;

  // Filter to only completed dates and sort descending (most recent first)
  const completedDates = filteredTracking
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
      currentStreak++;
      checkDate = prevDate;
    } else if (diff === 0) {
      continue;
    } else {
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
