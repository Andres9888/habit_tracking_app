/**
 * Streak resolution for the habits list.
 *
 * Wraps the client-side streak walk with the server cross-check described in
 * resolveDisplayedStreak: the client value stays authoritative for optimistic
 * toggles, the server value rescues runs the fetched window truncated and
 * streaks the client can't see across a pause.
 */

import { useMemo } from 'react';

import { buildStreakRunByHabit } from './useHabitsTracking.completions';
import type { ServerStreakInfo } from './resolveDisplayedStreak';
import { buildResolvedStreakByHabit } from './resolveDisplayedStreak';

/** Minimal habit shape needed to cross-check client streaks against the server. */
export interface StreakSourceHabit extends ServerStreakInfo {
  _id: string;
}

export function useResolvedStreaks(
  completedDatesByHabit: Map<string, Set<string>>,
  stableToday: Date,
  habits: readonly StreakSourceHabit[],
  windowStart: string
): Map<string, number> {
  const streakRunByHabit = useMemo(
    () => buildStreakRunByHabit(completedDatesByHabit, stableToday),
    [completedDatesByHabit, stableToday]
  );
  // Keyed on the habits array identity, so unchanged lists never reallocate.
  const serverStreakInfoByHabit = useMemo(() => {
    const map = new Map<string, ServerStreakInfo>();
    for (const habit of habits) {
      map.set(habit._id, {
        currentStreak: habit.currentStreak,
        pausedAt: habit.pausedAt,
      });
    }
    return map;
  }, [habits]);

  return useMemo(
    () =>
      buildResolvedStreakByHabit(
        streakRunByHabit,
        serverStreakInfoByHabit,
        windowStart
      ),
    [streakRunByHabit, serverStreakInfoByHabit, windowStart]
  );
}
