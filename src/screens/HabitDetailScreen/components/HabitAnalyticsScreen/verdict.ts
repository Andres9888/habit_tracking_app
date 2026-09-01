/**
 * The verdict that opens Analytics.
 *
 * The question people arrive with is "am I getting better?", so the page answers
 * it in words first and shows the evidence underneath. Everything here is
 * derived from `buildMonthlyRates` — no new data, and nothing predicted.
 */

import type { MonthRate } from '../../insights';
import { MONTH_SHORT } from './weeklyBars';

/** Percentage points a month must move before it counts as a direction. */
const MEANINGFUL_PCT = 5;
/** Months drawn in the sparkline. */
const SPARK_MONTHS = 6;

export interface Verdict {
  headline: string;
  body: string;
  /** This month minus last month, in percentage points. */
  deltaPct: number;
  /** Completion rate per month, oldest first. */
  bars: number[];
  labels: string[];
}

function headlineFor(deltaPct: number): string {
  if (deltaPct >= MEANINGFUL_PCT) return "You're steadier than last month.";
  if (deltaPct <= -MEANINGFUL_PCT) return "You've slipped since last month.";
  return "You're holding steady.";
}

/** Consecutive month-over-month gains ending at the latest month. */
function gainStreak(rates: readonly MonthRate[]): number {
  let count = 0;
  for (let index = rates.length - 1; index > 0; index -= 1) {
    const month = rates[index];
    const before = rates[index - 1];
    if (!month || !before || month.ratePct <= before.ratePct) break;
    count += 1;
  }
  return count;
}

function bodyFor(current: MonthRate, previous: MonthRate, gains: number) {
  const direction =
    current.ratePct === previous.ratePct
      ? 'level with'
      : current.ratePct > previous.ratePct
        ? 'up from'
        : 'down from';
  const lead = `${current.ratePct}% of scheduled days in ${current.label}, ${direction} ${previous.ratePct}% in ${previous.label}.`;
  return gains >= 2 ? `${lead} ${gains} months of gains in a row.` : lead;
}

/** Null until two elapsed months carry real scheduled days. */
export function buildVerdict(rates: readonly MonthRate[]): Verdict | null {
  const scored = rates.filter((month) => month.scheduled > 0);
  const current = scored[scored.length - 1];
  const previous = scored[scored.length - 2];
  if (!current || !previous) return null;

  const window = scored.slice(-SPARK_MONTHS);
  return {
    bars: window.map((month) => month.ratePct),
    body: bodyFor(current, previous, gainStreak(scored)),
    deltaPct: current.ratePct - previous.ratePct,
    headline: headlineFor(current.ratePct - previous.ratePct),
    labels: window.map((month) => MONTH_SHORT[month.month] ?? ''),
  };
}
