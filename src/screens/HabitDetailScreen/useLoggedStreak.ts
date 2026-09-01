/**
 * The current streak as the completion log actually reports it.
 *
 * `habit.currentStreak` is a stored field: nothing recomputes it when a day is
 * missed, so after a miss it keeps claiming the run that already ended until
 * the next server write lands. Anything user-facing that says "N-day streak"
 * has to be derived from the completions instead — same rule, same runs, same
 * source of truth as the History rail (`insights/streakRuns.ts`).
 */

import { useMemo } from 'react';
import { buildStreakRuns, streakStats } from './insights/streakRuns';

interface LoggedStreakOptions {
  /** Post-toggle state for today, so the number is the one after the tap. */
  isCompletedToday: boolean;
  pausedAt?: number;
  resumedAt?: number;
  today: string;
}

export function useLoggedStreak(
  completedDates: Set<string>,
  { isCompletedToday, pausedAt, resumedAt, today }: LoggedStreakOptions
): number {
  return useMemo(() => {
    const dates = new Set(completedDates);
    if (isCompletedToday) dates.add(today);
    else dates.delete(today);
    const runs = buildStreakRuns({
      completedDates: dates,
      pausedAt,
      resumedAt,
      today,
    });
    return streakStats(runs).current;
  }, [completedDates, isCompletedToday, pausedAt, resumedAt, today]);
}
