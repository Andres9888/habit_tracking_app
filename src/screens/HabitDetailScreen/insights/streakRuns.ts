/**
 * Streak runs — every run this habit has put together, with its dates.
 *
 * "Your runs" on History and the "Streaks are getting longer" row on Analytics
 * both read this. It is a pure reduce over the same completion set the rest of
 * the screen uses, so no new query is needed.
 *
 * THE BREAK RULE IS THE BACKEND'S, DELIBERATELY. `convex/streakUtils/
 * historyCalculation.ts` counts a streak as consecutive CALENDAR days with
 * paused days discounted — it is not schedule-aware, so a Mon/Wed/Fri habit
 * breaks its streak on Tuesday there. An earlier revision of this file skipped
 * unscheduled days instead, which read better but meant the run bars could
 * disagree with the "Current" and "Longest" numbers sitting directly above
 * them. Same rule, one source of truth: `streakStats` below derives those
 * numbers from these runs rather than from the habit document.
 */

import { format } from 'date-fns';
import { isCompletionHiddenByPause } from '../../../../convex/streakUtils/pausePeriod';
import { getLocalDateString } from '../../../utils/getLocalDateString';
import { clientPauseInfo, effectiveDiff } from './effectiveDayDiff';
import { parseLocalDate } from './schedule';

export interface StreakRun {
  /** First completed day of the run, YYYY-MM-DD. */
  start: string;
  /** Last completed day of the run, YYYY-MM-DD. */
  end: string;
  length: number;
  /** True for the run that is still alive today. */
  isCurrent: boolean;
}

export interface StreakRunsInput {
  completedDates: Set<string>;
  pausedAt?: number;
  resumedAt?: number;
  /** Today as YYYY-MM-DD; injectable for tests. */
  today?: string;
}

/** Every run, oldest first. The live run, when there is one, comes last. */
export function buildStreakRuns({
  completedDates,
  pausedAt,
  resumedAt,
  today = getLocalDateString(),
}: StreakRunsInput): StreakRun[] {
  const pauseInfo = clientPauseInfo({ pausedAt, resumedAt });
  const dates = [...completedDates]
    .filter(
      (date) =>
        date <= today &&
        (!pausedAt || !isCompletionHiddenByPause(date, pauseInfo))
    )
    .sort();

  const runs: StreakRun[] = [];
  let open: StreakRun | null = null;

  for (const date of dates) {
    if (open === null) {
      open = { end: date, isCurrent: false, length: 1, start: date };
      continue;
    }
    const gap = effectiveDiff(date, open.end, pauseInfo);
    if (gap === 0) continue;
    if (gap === 1) {
      open.end = date;
      open.length += 1;
      continue;
    }
    runs.push(open);
    open = { end: date, isCurrent: false, length: 1, start: date };
  }
  if (open) runs.push(open);

  // Today is still open: yesterday's run is live until today is actually missed.
  const last = runs[runs.length - 1];
  if (last && effectiveDiff(today, last.end, pauseInfo) <= 1) {
    last.isCurrent = true;
  }
  return runs;
}

export interface StreakStats {
  current: number;
  longest: number;
}

/** The two numbers the rail shows, from the same runs the bars draw. */
export function streakStats(runs: readonly StreakRun[]): StreakStats {
  return {
    current: runs.find((run) => run.isCurrent)?.length ?? 0,
    longest: runs.reduce((top, run) => Math.max(top, run.length), 0),
  };
}

/** Live run first, then the longest of the rest. */
export function rankStreakRuns(
  runs: readonly StreakRun[],
  limit = 4
): StreakRun[] {
  const current = runs.find((run) => run.isCurrent);
  const rest = [...runs]
    .filter((run) => !run.isCurrent)
    .sort((a, b) => b.length - a.length);
  return (current ? [current, ...rest] : rest).slice(0, limit);
}

/** "Jun 3 – 14", collapsing the month when both ends share it. */
export function runRangeLabel(run: StreakRun, today = getLocalDateString()) {
  const start = parseLocalDate(run.start);
  const end = parseLocalDate(run.end);
  const tail =
    run.end === today
      ? 'today'
      : format(end, start.getMonth() === end.getMonth() ? 'd' : 'MMM d');
  return `${format(start, 'MMM d')} – ${tail}`;
}

export interface RunTrend {
  /** Mean run length over the older half of the runs, one decimal. */
  earlierAvg: number;
  /** Mean run length over the newer half. */
  recentAvg: number;
  /** True when runs have lengthened by a day or more on average. */
  improving: boolean;
}

/** Runs needed before an older/newer comparison says anything. */
const MIN_RUNS_FOR_TREND = 4;

function meanLength(runs: readonly StreakRun[]): number {
  if (runs.length === 0) return 0;
  const total = runs.reduce((sum, run) => sum + run.length, 0);
  return Math.round((total / runs.length) * 10) / 10;
}

/** Older half vs newer half of the runs, in chronological order. */
export function runTrend(runs: readonly StreakRun[]): RunTrend | null {
  if (runs.length < MIN_RUNS_FOR_TREND) return null;
  const half = Math.floor(runs.length / 2);
  const earlierAvg = meanLength(runs.slice(0, half));
  const recentAvg = meanLength(runs.slice(half));
  return { earlierAvg, improving: recentAvg >= earlierAvg + 1, recentAvg };
}
