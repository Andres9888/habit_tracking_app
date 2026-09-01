/**
 * The next step inside "Where you stand".
 *
 * The verdict says where you are; this line says what the arithmetic would have
 * looked like with the one weak weekday covered. It only ever states what
 * already happened — "would have put August at 94%" — because a month that has
 * not been lived is not evidence, and this page promises nothing is predicted.
 *
 * Omitted rather than softened whenever the projection adds nothing: with no
 * misses left to recover, or with the month already the window's high-water
 * mark, the only thing left to say is what the "…are where it slips" row below
 * already says.
 */

import { parseLocalDate } from '../../insights';
import type { MonthRate, OneFixInsight, WeekdayStat } from '../../insights';

/** The threshold behind "the only weekday under 60%". */
const ONLY_UNDER_PCT = 60;

export interface NextStep {
  text: string;
}

interface NextStepSource {
  doneDates: ReadonlySet<string>;
  oneFix: OneFixInsight | null;
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

/** Occurrences of `weekday` in the elapsed part of this month, never logged. */
function missesThisMonth(
  doneDates: ReadonlySet<string>,
  today: string,
  weekday: number
): number {
  const cursor = parseLocalDate(today);
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  let missed = 0;
  for (let day = 1; day <= cursor.getDate(); day += 1) {
    if (new Date(year, month, day).getDay() !== weekday) continue;
    if (!doneDates.has(`${year}-${pad(month + 1)}-${pad(day)}`)) missed += 1;
  }
  return missed;
}

/** The evidence clause, or null when neither form is literally true. */
function evidenceFor(
  bars: readonly WeekdayStat[],
  weakest: WeekdayStat
): string | null {
  const others = bars.filter(
    (bar) => bar.scheduled > 0 && bar.weekday !== weakest.weekday
  );
  if (others.length === 0) return null;

  const weakPct = Math.round(weakest.rate * 100);
  const lowest = Math.min(...others.map((bar) => Math.round(bar.rate * 100)));
  if (weakPct < ONLY_UNDER_PCT && lowest >= ONLY_UNDER_PCT) {
    return `It's the only weekday under ${ONLY_UNDER_PCT}%.`;
  }
  const floor = Math.floor((lowest - 1) / 10) * 10;
  if (floor <= weakPct) return null;
  return `${weakest.plural} sit at ${weakPct}% — every other day is above ${floor}%.`;
}

/** Null unless covering the weak weekday would have moved this month's rate. */
export function buildNextStep(
  { doneDates, oneFix }: NextStepSource,
  months: readonly MonthRate[],
  today: string
): NextStep | null {
  if (!oneFix) return null;
  const current = months[months.length - 1];
  if (!current || current.scheduled === 0) return null;

  const earlier = months.slice(0, -1);
  if (!earlier.some((month) => month.ratePct > current.ratePct)) return null;

  const missed = missesThisMonth(doneDates, today, oneFix.weakest.weekday);
  if (missed === 0) return null;
  const covered = (current.done + missed) / current.scheduled;
  const projected = Math.round(covered * 100);
  if (projected <= current.ratePct) return null;

  const lead = `Covering ${oneFix.weakest.plural} would have put ${current.label} at ${projected}%.`;
  const evidence = evidenceFor(oneFix.bars, oneFix.weakest);
  return { text: evidence ? `${lead} ${evidence}` : lead };
}
