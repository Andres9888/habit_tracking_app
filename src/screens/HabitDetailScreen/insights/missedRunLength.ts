/**
 * How many scheduled days in a row were missed, counting back from yesterday?
 *
 * `missedLastScheduledDate` only names the most recent unlogged scheduled day,
 * so a two-day miss was described as one — the week strip showed two dashed
 * circles under a sentence that said "Yesterday". This counts the whole run so
 * the recovery headline can be exactly true.
 *
 * Schedule- and pause-aware by construction: every day is classified with the
 * same `getHabitDayState` the week strip and History draw from, so unscheduled
 * and paused days are stepped over rather than counted, and the walk stops at
 * the first completed day or at the habit's creation date.
 */

import { addDays } from 'date-fns';
import {
  getHabitDayState,
  type HabitDayContext,
} from '../../../features/habits/habitDayState';
import { getLocalDateString } from '../../../utils/getLocalDateString';
import { parseLocalDate } from './schedule';

export interface MissedRunOptions extends HabitDayContext {
  completedDates: Set<string>;
  /** Today as YYYY-MM-DD; injectable for tests. */
  today?: string;
}

/** Safety bound — a year of dashed days is already far past "a week". */
const MAX_LOOKBACK_DAYS = 400;

export function missedRunLength({
  completedDates,
  createdAt,
  daysOfWeek,
  pausedAt,
  resumedAt,
  today = getLocalDateString(),
}: MissedRunOptions): number {
  let missed = 0;
  let cursor = addDays(parseLocalDate(today), -1);

  for (let step = 0; step < MAX_LOOKBACK_DAYS; step += 1) {
    const date = getLocalDateString(cursor);
    const state = getHabitDayState({
      completed: completedDates.has(date),
      createdAt,
      date,
      daysOfWeek,
      pausedAt,
      resumedAt,
      today,
    });
    if (state === 'missed') missed += 1;
    else if (state !== 'unscheduled' && state !== 'paused') break;
    cursor = addDays(cursor, -1);
  }

  return missed;
}
