import { useCallback, useMemo } from 'react';
import { useQuery } from 'convex/react';

import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import { useOptimisticStore } from '../../../lib/optimistic';
import type { HabitStatus } from '../types';
import {
  buildCompletedDatesByHabit,
  buildDateStatusCache,
  buildStreakByHabit,
  buildTrackingQueryArgs,
  getDateStatusInfo,
  normalizeToday,
} from './useHabitsTracking.helpers';

export function useHabitsTracking(extendedDateStrings: string[], today: Date) {
  const stableToday = useMemo(
    () => normalizeToday(today),
    [today.getDate(), today.getFullYear(), today.getMonth()]
  );
  const firstDateString = extendedDateStrings[0];
  const lastDateString = extendedDateStrings.at(-1);
  const queryArgs = useMemo(
    () => buildTrackingQueryArgs(firstDateString, lastDateString),
    [firstDateString, lastDateString]
  );
  const tracking = useQuery(api.habits.getTracking, queryArgs) ?? [];
  const { pendingToggles } = useOptimisticStore();
  const completedDatesByHabit = useMemo(() => {
    return buildCompletedDatesByHabit(tracking, pendingToggles);
  }, [pendingToggles, tracking]);
  const streakByHabit = useMemo(
    () => buildStreakByHabit(completedDatesByHabit, stableToday),
    [completedDatesByHabit, stableToday]
  );
  const getStreak = useCallback((habitId: string) => streakByHabit.get(habitId) ?? 0, [streakByHabit]);
  const dateStatusCache = useMemo(
    () => buildDateStatusCache(extendedDateStrings, stableToday),
    [extendedDateStrings, stableToday]
  );

  const getHabitStatus = useCallback(
    (habitId: string, dateString: string): HabitStatus => {
      const normalizedDateString = dateString.trim();
      if (!normalizedDateString) return 'planned';
      const dateStatusInfo = getDateStatusInfo(dateStatusCache, normalizedDateString, stableToday);
      if (!dateStatusInfo.isValid) return 'planned';
      if (completedDatesByHabit.get(habitId)?.has(normalizedDateString)) return 'done';
      return dateStatusInfo.status;
    },
    [completedDatesByHabit, dateStatusCache, stableToday]
  );

  const isCompleted = useCallback(
    (habitId: Id<'habits'>, date: string): boolean => getHabitStatus(habitId, date) === 'done',
    [getHabitStatus]
  );

  return { getHabitStatus, getStreak, isCompleted, tracking };
}
