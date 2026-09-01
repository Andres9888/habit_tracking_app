/**
 * How long was the run the miss ended?
 *
 * The recovery headline ("Yesterday got away. Eight days didn't.") is only
 * allowed to name a number the completion log can back up, so this reads the
 * same runs the History rail draws.
 */

import type { StreakRun } from './streakRuns';
import { effectiveDayDiff, type PauseWindow } from './effectiveDayDiff';
import {
  isScheduledWeekday,
  parseLocalDate,
  scheduledWeekdays,
} from './schedule';

export interface BrokenRunOptions extends PauseWindow {
  daysOfWeek?: number[];
}

/** True when every day strictly between `end` and `missedDate` is unscheduled. */
function onlyOffDaysBetween(
  end: string,
  missedDate: string,
  daysOfWeek?: number[]
): boolean {
  const scheduled = scheduledWeekdays({ daysOfWeek });
  if (scheduled === null) return false;
  const missed = parseLocalDate(missedDate);
  const cursor = parseLocalDate(end);
  cursor.setDate(cursor.getDate() + 1);
  if (cursor >= missed) return false;
  while (cursor < missed) {
    if (isScheduledWeekday(scheduled, cursor.getDay())) return false;
    cursor.setDate(cursor.getDate() + 1);
  }
  return true;
}

/**
 * Length of the run the miss ended, newest run first. A run qualifies when it
 * reached the last EFFECTIVE day before the miss — one pause-discounted day
 * back, or across nothing but unscheduled days. Demanding the strict calendar
 * day before meant a Mon/Wed/Fri habit could never report a broken run, because
 * `missedLastScheduledDate` walks back over the weekend while runs are counted
 * in calendar days. Zero when the miss followed a real gap.
 */
export function brokenRunLength(
  runs: readonly StreakRun[],
  missedDate: string,
  { daysOfWeek, pausedAt, resumedAt }: BrokenRunOptions = {}
): number {
  for (let index = runs.length - 1; index >= 0; index -= 1) {
    const run = runs[index];
    if (!run || run.end >= missedDate) continue;
    if (effectiveDayDiff(missedDate, run.end, { pausedAt, resumedAt }) === 1) {
      return run.length;
    }
    if (onlyOffDaysBetween(run.end, missedDate, daysOfWeek)) return run.length;
  }
  return 0;
}
