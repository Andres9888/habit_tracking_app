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

import { addDays } from 'date-fns';
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
