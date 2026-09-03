/**
 * Monthly rates for the History surface's "Year at a glance" caption.
 *
 * The design writes the caption as "Getting stronger every month — May was your
 * turning point.", which is only honest when a turning point actually exists, so
 * detection is explicit: a month is the turning point when its rate clears the
 * average of every month before it by a real margin and the months since have
 * held up. With no such month the caption is omitted rather than softened.
 */

import { eachDayOfInterval, endOfMonth } from 'date-fns';
import { getLocalDateString } from '../../../utils/getLocalDateString';
import {
  isScheduledWeekday,
  parseLocalDate,
  scheduledWeekdays,
} from './schedule';

/** Months needed before a turning point can be claimed at all. */
const MIN_MONTHS = 4;
/** Percentage points a month must clear the prior average by. */
const STEP_UP_PCT = 12;

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export interface MonthRate {
  /** 0-11. */
  month: number;
  label: string;
  done: number;
  scheduled: number;
  ratePct: number;
}

interface MonthlyRatesInput {
  completedDates: Set<string>;
  /**
   * Days before the habit existed are not scheduled — the user wasn't playing.
   * Backfilled completions predate creation, so they move the start earlier.
   */
  createdAt?: number;
  daysOfWeek?: number[];
  /** Today as YYYY-MM-DD; injectable for tests. */
  today?: string;
}

/**
 * Earliest day the habit counts as scheduled: the creation date, or an earlier
 * backfilled completion when one exists. Null when neither is known.
 */
export function rateWindowStart(
  created: string | null,
  completedDates: Set<string>
): string | null {
  let earliest = created;
  for (const date of completedDates) {
    if (earliest === null || date < earliest) earliest = date;
  }
  return earliest;
}

/** Elapsed months of the current year, oldest first. Partial months included. */
export function buildMonthlyRates({
  completedDates,
  createdAt,
  daysOfWeek,
  today = getLocalDateString(),
}: MonthlyRatesInput): MonthRate[] {
  const cursor = parseLocalDate(today);
  const year = cursor.getFullYear();
  const scheduled = scheduledWeekdays({ daysOfWeek });
  const created =
    createdAt === undefined ? null : getLocalDateString(new Date(createdAt));
  const windowStart =
    created === null ? null : rateWindowStart(created, completedDates);

  return Array.from({ length: cursor.getMonth() + 1 }, (_, month) => {
    const start = new Date(year, month, 1);
    const monthEnd = endOfMonth(start);
    const end = monthEnd > cursor ? cursor : monthEnd;
    const days = eachDayOfInterval({ end, start }).filter(
      (date) =>
        isScheduledWeekday(scheduled, date.getDay()) &&
        (windowStart === null || getLocalDateString(date) >= windowStart)
    );
    const done = days.filter((date) =>
      completedDates.has(getLocalDateString(date))
    ).length;
    return {
      done,
      label: MONTH_NAMES[month] ?? '',
      month,
      ratePct: days.length === 0 ? 0 : Math.round((done / days.length) * 100),
      scheduled: days.length,
    };
  });
}

/** The month rates stepped up at and never fell back from, if there is one. */
export function turningPoint(rates: readonly MonthRate[]): MonthRate | null {
  if (rates.length < MIN_MONTHS) return null;

  let best: { month: MonthRate; lift: number } | null = null;
  for (let index = 1; index < rates.length; index += 1) {
    const month = rates[index];
    if (!month || month.scheduled === 0) continue;
    const before = rates.slice(0, index).filter((entry) => entry.scheduled > 0);
    const since = rates.slice(index).filter((entry) => entry.scheduled > 0);
    if (before.length === 0 || since.length === 0) continue;

    const priorAvg =
      before.reduce((sum, entry) => sum + entry.ratePct, 0) / before.length;
    const sinceAvg =
      since.reduce((sum, entry) => sum + entry.ratePct, 0) / since.length;
    const lift = sinceAvg - priorAvg;
    if (lift < STEP_UP_PCT) continue;
    if (best === null || lift > best.lift) best = { lift, month };
  }
  return best?.month ?? null;
}

/** Caption for the year grid, or null when the data says nothing yet. */
export function trendCaption(rates: readonly MonthRate[]): string | null {
  const point = turningPoint(rates);
  if (point === null) return null;
  return `Getting stronger — ${point.label} was your turning point.`;
}

/** "Jan – Jul" across the elapsed months; a single month renders alone. */
export function monthRangeLabel(rates: readonly MonthRate[]): string {
  const first = rates[0]?.label.slice(0, 3);
  const last = rates[rates.length - 1]?.label.slice(0, 3);
  if (!first || !last) return '';
  return first === last ? first : `${first} – ${last}`;
}

/** Highest-rate month among those with a meaningful sample, if any. */
export function bestMonth(rates: readonly MonthRate[]): MonthRate | null {
  const eligible = rates.filter((entry) => entry.scheduled >= 7);
  if (eligible.length === 0) return null;
  return eligible.reduce((top, entry) =>
    entry.ratePct > top.ratePct ? entry : top
  );
}
