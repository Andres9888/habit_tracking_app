/** Memoised streak runs — shared by History's rail and Analytics' trend row. */

import { useMemo } from 'react';
import { buildStreakRuns, type StreakRun } from './streakRuns';

interface UseStreakRunsPause {
  pausedAt?: number;
  resumedAt?: number;
}

export function useStreakRuns(
  completedDates: Set<string>,
  { pausedAt, resumedAt }: UseStreakRunsPause = {}
): StreakRun[] {
  return useMemo(
    () => buildStreakRuns({ completedDates, pausedAt, resumedAt }),
    [completedDates, pausedAt, resumedAt]
  );
}
