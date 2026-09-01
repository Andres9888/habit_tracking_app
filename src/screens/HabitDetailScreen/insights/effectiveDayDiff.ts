/**
 * Pause-aware day arithmetic — the one place the client discounts paused days.
 *
 * `buildStreakRuns` uses it to decide whether two completions are consecutive,
 * and `brokenRunLength` uses it to decide whether a run ended the day before a
 * miss. Those two answers have to agree, so they share this helper rather than
 * each rolling their own subtraction.
 */

import {
  countPausedDaysBetween,
  type PauseInfo,
} from '../../../../convex/streakUtils/pausePeriod';
import { getLocalDateString } from '../../../utils/getLocalDateString';
import { parseLocalDate } from './schedule';

const MS_PER_DAY = 86_400_000;

export interface PauseWindow {
  pausedAt?: number;
  resumedAt?: number;
}

export function clientPauseInfo({
  pausedAt,
  resumedAt,
}: PauseWindow = {}): PauseInfo {
  return {
    dateKeyForMs: (ms) => getLocalDateString(new Date(ms)),
    pausedAt,
    resumedAt,
  };
}

/** Calendar days between two date keys, minus any paused days in between. */
export function effectiveDiff(
  later: string,
  earlier: string,
  pauseInfo: PauseInfo
): number {
  const calendar = Math.round(
    (parseLocalDate(later).getTime() - parseLocalDate(earlier).getTime()) /
      MS_PER_DAY
  );
  if (calendar <= 0 || !pauseInfo.pausedAt) return calendar;
  return calendar - countPausedDaysBetween(earlier, later, pauseInfo);
}

/** `effectiveDiff` for callers that hold the raw pause fields, not a PauseInfo. */
export function effectiveDayDiff(
  later: string,
  earlier: string,
  pause: PauseWindow = {}
): number {
  return effectiveDiff(later, earlier, clientPauseInfo(pause));
}
