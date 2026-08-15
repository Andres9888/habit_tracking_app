/**
 * Calculate streak from full tracking history
 */

import { calculateBestStreakFromDates, differenceInDays } from './dateHelpers';
import {
  countPausedDaysBetween,
  isCompletionHiddenByPause,
  type PauseInfo,
} from './pausePeriod';
import type { StreakData, TrackingRecord } from './types';

function dayDiff(later: string, earlier: string): number {
  return differenceInDays(
    new Date(`${later}T00:00:00`),
    new Date(`${earlier}T00:00:00`)
  );
}

function effectiveDiff(
  later: string,
  earlier: string,
  pauseInfo?: PauseInfo
): number {
  const calendar = dayDiff(later, earlier);
  if (calendar <= 0 || !pauseInfo?.pausedAt) return calendar;
  return calendar - countPausedDaysBetween(earlier, later, pauseInfo);
}

function bestStreakWithPause(dates: string[], pauseInfo?: PauseInfo): number {
  if (!pauseInfo?.pausedAt) return calculateBestStreakFromDates(dates);
  if (dates.length === 0) return 0;
  const sorted = [...dates].sort((a, b) => a.localeCompare(b));
  let best = 1;
  let run = 1;
  for (let index = 1; index < sorted.length; index += 1) {
    const gap = effectiveDiff(sorted[index], sorted[index - 1], pauseInfo);
    if (gap === 1) {
      run += 1;
      best = Math.max(best, run);
    } else if (gap > 1) {
      run = 1;
    }
  }
  return best;
}

/**
 * Calculate streak from full tracking history.
 * Pause days do not break the current or best streak.
 */
export function calculateStreakFromHistory(
  tracking: TrackingRecord[],
  todayDate: string,
  pauseInfo?: PauseInfo
): StreakData {
  const filteredTracking = pauseInfo?.pausedAt
    ? tracking.filter((row) => !isCompletionHiddenByPause(row.date, pauseInfo))
    : tracking;

  const completedDates = filteredTracking
    .filter((row) => row.completed)
    .map((row) => row.date)
    .sort((left, right) => right.localeCompare(left));

  if (completedDates.length === 0) {
    return { bestStreak: 0, currentStreak: 0, lastCompletedDate: '' };
  }

  const lastCompletedDate = completedDates[0];
  const bestStreak = bestStreakWithPause(completedDates, pauseInfo);

  if (effectiveDiff(todayDate, lastCompletedDate, pauseInfo) > 1) {
    return { bestStreak, currentStreak: 0, lastCompletedDate };
  }

  let currentStreak = 1;
  let checkDate = lastCompletedDate;
  for (let index = 1; index < completedDates.length; index += 1) {
    const prevDate = completedDates[index];
    const diff = effectiveDiff(checkDate, prevDate, pauseInfo);
    if (diff === 1) {
      currentStreak += 1;
      checkDate = prevDate;
    } else if (diff !== 0) {
      break;
    }
  }

  return {
    bestStreak: Math.max(bestStreak, currentStreak),
    currentStreak,
    lastCompletedDate,
  };
}

export { type PauseInfo } from './pausePeriod';
