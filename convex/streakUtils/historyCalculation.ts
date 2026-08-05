/**
 * Calculate streak from full tracking history
 */

import { calculateBestStreakFromDates, differenceInDays } from './dateHelpers';
import { msToDateKeyForTimezone } from '../habits/utils';
import type { StreakData, TrackingRecord } from './types';

/**
 * Optional pause information for streak calculation.
 * `timezone` (IANA name) ensures pause boundaries are evaluated against the
 * user's calendar day, matching how tracking date strings are stored.
 */
export interface PauseInfo {
  pausedAt?: number;
  resumedAt?: number;
  timezone?: string;
}

/**
 * Check if a date falls within a pause period. Compares date keys
 * (YYYY-MM-DD strings in the user's timezone) lexicographically — equivalent
 * to chronological comparison for ISO-formatted dates and immune to the
 * local-midnight-vs-UTC-ms offset bug.
 */
function isDateInPausePeriod(date: string, pauseInfo?: PauseInfo): boolean {
  if (!pauseInfo?.pausedAt) return false;

  const pausedAtKey = msToDateKeyForTimezone(
    pauseInfo.pausedAt,
    pauseInfo.timezone
  );
  const resumedAtKey =
    pauseInfo.resumedAt === undefined
      ? undefined
      : msToDateKeyForTimezone(pauseInfo.resumedAt, pauseInfo.timezone);

  if (resumedAtKey === undefined) {
    return date >= pausedAtKey;
  }
  return date >= pausedAtKey && date < resumedAtKey;
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
