/**
 * Weekday breakdown behind the "One fix to try" card.
 *
 * Walks every calendar day in the analysed window (not just days with a
 * tracking row) so a weekday the user silently skipped still counts as a miss.
 */

import {
  DISPLAY_ORDER,
  isScheduledWeekday,
  parseLocalDate,
  WEEKDAY_PLURAL,
  WEEKDAY_SHORT,
} from './schedule';
import type { OneFixInsight, WeekdayStat } from './types';

/** A weekday needs this many scheduled occurrences before we judge it. */
const MIN_OCCURRENCES = 3;
/** The weak day must be at or below this rate… */
const WEAK_RATE = 0.55;
/** …and at least this much worse than the average of the others. */
const MIN_GAP = 0.2;

function emptyStat(weekday: number): WeekdayStat {
  return {
    done: 0,
    plural: WEEKDAY_PLURAL[weekday] ?? '',
    rate: 0,
    scheduled: 0,
    short: WEEKDAY_SHORT[weekday] ?? '',
    weekday,
  };
}

/**
 * @param dates    Every scheduled calendar day in the window, ascending.
 * @param doneSet  Dates with a completed tracking row.
 */
export function buildWeekdayStats(
  dates: string[],
  doneSet: Set<string>,
  scheduled: Set<number> | null
): WeekdayStat[] {
  const stats = DISPLAY_ORDER.map((weekday) => emptyStat(weekday));
  const byWeekday = new Map(stats.map((stat) => [stat.weekday, stat]));

  for (const date of dates) {
    const weekday = parseLocalDate(date).getDay();
    if (!isScheduledWeekday(scheduled, weekday)) continue;
    const stat = byWeekday.get(weekday);
    if (!stat) continue;
    stat.scheduled += 1;
    if (doneSet.has(date)) stat.done += 1;
  }

  for (const stat of stats) {
    stat.rate = stat.scheduled === 0 ? 0 : stat.done / stat.scheduled;
  }
  return stats;
}

/** Misses among the most recent `limit` occurrences of one weekday. */
function recentMisses(
  dates: string[],
  doneSet: Set<string>,
  weekday: number,
  limit: number
): { missed: number; of: number } {
  const recent = dates
    .filter((date) => parseLocalDate(date).getDay() === weekday)
    .slice(-limit);
  const missed = recent.filter((date) => !doneSet.has(date)).length;
  return { missed, of: recent.length };
}

export function findOneFix(
  stats: WeekdayStat[],
  dates: string[],
  doneSet: Set<string>
): OneFixInsight | null {
  const judged = stats.filter((stat) => stat.scheduled >= MIN_OCCURRENCES);
  if (judged.length < 3) return null;

  const weakest = judged.reduce((low, stat) =>
    stat.rate < low.rate ? stat : low
  );
  if (weakest.rate > WEAK_RATE) return null;

  const others = judged.filter((stat) => stat.weekday !== weakest.weekday);
  const otherRate =
    others.reduce((sum, stat) => sum + stat.rate, 0) / (others.length || 1);
  if (otherRate - weakest.rate < MIN_GAP) return null;

  const recent = recentMisses(dates, doneSet, weakest.weekday, 4);
  return {
    bars: stats,
    recentMissed: recent.missed,
    recentOf: recent.of,
    weakest,
  };
}
