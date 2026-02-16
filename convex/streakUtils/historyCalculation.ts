/**
 * Calculate streak from full tracking history
 * Supports rest days - days of week where skipping doesn't break the streak
 */

import { calculateBestStreakFromDates, differenceInDays } from './dateHelpers';
import type { StreakData, TrackingRecord } from './types';

/**
 * Get the day of week (0=Sunday, 6=Saturday) from a YYYY-MM-DD string
 */
function getDayOfWeek(dateStr: string): number {
  return new Date(dateStr + 'T00:00:00').getDay();
}

/**
 * Check if a date string falls on a rest day
 */
function isRestDay(dateStr: string, restDays: number[]): boolean {
  return restDays.includes(getDayOfWeek(dateStr));
}

/**
 * Get the previous date string in YYYY-MM-DD format
 */
function prevDateStr(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

/**
 * Calculate streak from full tracking history
 * @param tracking - Array of tracking records with date and completed status
 * @param todayDate - Today's date in YYYY-MM-DD format
 * @param restDays - Optional array of rest day numbers (0=Sunday, 6=Saturday)
 * @returns Streak data calculated from history
 */
export function calculateStreakFromHistory(
  tracking: TrackingRecord[],
  todayDate: string,
  restDays: number[] = []
): StreakData {
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

  const completedSet = new Set(completedDates);
  const lastCompletedDate = completedDates[0];

  // Check streak is still active: walk backwards from today skipping rest days
  // Find the most recent non-rest day
  let checkDate = todayDate;
  const maxSkip = 7; // At most skip a full week of rest days
  let skipped = 0;
  while (isRestDay(checkDate, restDays) && skipped < maxSkip) {
    checkDate = prevDateStr(checkDate);
    skipped++;
  }

  // The streak is valid if the last completion is today, yesterday,
  // or the most recent non-rest day (accounting for rest days in between)
  const today = new Date(todayDate + 'T00:00:00');
  const lastCompleted = new Date(lastCompletedDate + 'T00:00:00');
  const daysSinceLastCompletion = differenceInDays(today, lastCompleted);

  // Count rest days between last completion and today
  let restDaysBetween = 0;
  if (restDays.length > 0 && daysSinceLastCompletion > 1) {
    let d = lastCompletedDate;
    for (let i = 0; i < daysSinceLastCompletion - 1; i++) {
      d = nextDateStr(d);
      if (isRestDay(d, restDays)) {
        restDaysBetween++;
      }
    }
  }

  // Streak is broken if there are non-rest days between last completion and today
  // that weren't completed. Grace period: 1 non-rest day gap allowed.
  const effectiveGap = daysSinceLastCompletion - restDaysBetween;
  if (effectiveGap > 1) {
    const bestStreak = calculateBestStreakFromDatesWithRestDays(completedSet, completedDates, restDays);
    return {
      bestStreak,
      currentStreak: 0,
      lastCompletedDate,
    };
  }

  // Count consecutive days backwards, skipping rest days
  let currentStreak = 0;
  let cursor = lastCompletedDate;
  const maxLookback = 400;

  for (let i = 0; i < maxLookback; i++) {
    if (isRestDay(cursor, restDays)) {
      // Rest day - skip it (don't count, don't break)
      cursor = prevDateStr(cursor);
      continue;
    }
    if (completedSet.has(cursor)) {
      currentStreak++;
      cursor = prevDateStr(cursor);
    } else {
      break;
    }
  }

  const bestStreak = calculateBestStreakFromDatesWithRestDays(completedSet, completedDates, restDays);

  return {
    bestStreak: Math.max(bestStreak, currentStreak),
    currentStreak,
    lastCompletedDate,
  };
}

/**
 * Get the next date string in YYYY-MM-DD format
 */
function nextDateStr(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

/**
 * Calculate best streak considering rest days
 */
function calculateBestStreakFromDatesWithRestDays(
  completedSet: Set<string>,
  completedDates: string[],
  restDays: number[]
): number {
  if (restDays.length === 0) {
    return calculateBestStreakFromDates(completedDates);
  }

  if (completedDates.length === 0) return 0;

  const sortedAsc = [...completedDates].sort((a, b) => a.localeCompare(b));
  const first = sortedAsc[0];
  const last = sortedAsc[sortedAsc.length - 1];

  let bestStreak = 0;
  let currentRun = 0;
  let cursor = first;

  while (cursor <= last) {
    if (isRestDay(cursor, restDays)) {
      // Rest day - skip, don't affect streak
      cursor = nextDateStr(cursor);
      continue;
    }
    if (completedSet.has(cursor)) {
      currentRun++;
      bestStreak = Math.max(bestStreak, currentRun);
    } else {
      currentRun = 0;
    }
    cursor = nextDateStr(cursor);
  }

  return bestStreak;
}
