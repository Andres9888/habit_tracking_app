/**
 * Was yesterday a miss?
 *
 * Drives the recovery state the design lists under MVP "Ship": when yesterday
 * was scheduled and skipped, the hero swaps its headline for
 * "One miss doesn't erase N days" plus the two-minute CTA. The streak has
 * already reset to 0 by then, so the copy leans on the numbers that persist —
 * days done and the personal best — rather than the run that just ended.
 *
 * Only a SCHEDULED day counts. A three-day-a-week habit skipping Tuesday has
 * not missed anything, and telling them otherwise is the exact scolding the
 * redesign exists to remove.
 */

import { addDays, format } from 'date-fns';
import { getLocalDateString } from '../../../utils/getLocalDateString';
import {
  isScheduledWeekday,
  parseLocalDate,
  scheduledWeekdays,
} from './schedule';

interface MissedYesterdayInput {
  completedDates: Set<string>;
  daysOfWeek?: number[];
  /** Skip the state entirely once today is logged — the miss is behind them. */
  isCompletedToday: boolean;
  /** Today as YYYY-MM-DD; injectable for tests. */
  today?: string;
}

/** The most recent scheduled date before today, when that date is unlogged. */
export function missedLastScheduledDate({
  completedDates,
  daysOfWeek,
  isCompletedToday,
  today = getLocalDateString(),
}: MissedYesterdayInput): string | null {
  if (isCompletedToday) return null;

  const scheduled = scheduledWeekdays({ daysOfWeek });
  let cursor = addDays(parseLocalDate(today), -1);
  for (let offset = 1; offset <= 7; offset += 1) {
    if (isScheduledWeekday(scheduled, cursor.getDay())) {
      const date = getLocalDateString(cursor);
      return completedDates.has(date) ? null : date;
    }
    cursor = addDays(cursor, -1);
  }
  return null;
}

/** Human copy for the missed scheduled date; weekday names avoid false recency. */
export function recoveryMissedDayLabel(
  missedDate: string,
  today = getLocalDateString()
): string {
  const yesterday = getLocalDateString(addDays(parseLocalDate(today), -1));
  if (missedDate === yesterday) return 'Yesterday';
  return format(parseLocalDate(missedDate), 'EEEE');
}

export function isMissedYesterday({
  completedDates,
  daysOfWeek,
  isCompletedToday,
  today = getLocalDateString(),
}: MissedYesterdayInput): boolean {
  if (isCompletedToday) return false;

  const yesterday = addDays(parseLocalDate(today), -1);
  const date = getLocalDateString(yesterday);
  if (completedDates.has(date)) return false;

  return isScheduledWeekday(
    scheduledWeekdays({ daysOfWeek }),
    yesterday.getDay()
  );
}

/**
 * The headline number. Prefers the personal best — "doesn't erase 12 days"
 * reads as the record still standing — and falls back to total days done when
 * there is no best yet.
 */
export function recoveryHeadline(bestStreak: number, daysDone: number): string {
  const kept = bestStreak > 0 ? bestStreak : daysDone;
  if (kept <= 0) return "One miss doesn't undo anything.";
  return `One miss doesn't erase ${kept} ${kept === 1 ? 'day' : 'days'}.`;
}
