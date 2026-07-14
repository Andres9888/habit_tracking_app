import { useCallback, useMemo } from 'react';

import { api } from '../../../../convex/_generated/api';
import { useCachedQuery } from '../../../lib/queryCache';
import type { Id } from '../../../../convex/_generated/dataModel';
import { usePendingToggles } from '../../../lib/optimistic';
import type { HabitStatus, HabitTrackingEntry } from '../types';
import {
  buildCompletedDatesByHabit,
  buildDateStatusCache,
  buildStreakByHabit,
  buildTrackingQueryArgs,
  getDateStatusInfo,
  normalizeToday,
} from './useHabitsTracking.helpers';
import { useTrackingWindow } from './useTrackingWindow';

interface UseHabitsTrackingOptions {
  enabled?: boolean;
  fallbackToLatest?: boolean;
  fallbackTracking?: HabitTrackingEntry[];
  windowBufferDays?: number;
}

const EMPTY_TRACKING: HabitTrackingEntry[] = [];

export function useHabitsTracking(
  extendedDateStrings: string[],
  today: Date,
  options: UseHabitsTrackingOptions = {}
) {
  const enabled = options.enabled ?? true;
  const stableToday = useMemo(
    () => normalizeToday(today),
    [today.getDate(), today.getFullYear(), today.getMonth()]
  );
  // Query a stable buffered window instead of the shifting visible range, so
  // week navigation within the buffer reuses the same subscription.
  const { windowStart, windowEnd, windowDateStrings } = useTrackingWindow(
    extendedDateStrings,
    stableToday,
    options.windowBufferDays
  );
  const queryArgs = useMemo(
    () =>
      enabled && windowStart && windowEnd
        ? buildTrackingQueryArgs(windowStart, windowEnd)
        : 'skip',
    [enabled, windowStart, windowEnd]
  );
  const queriedTracking = useCachedQuery(api.habits.getTracking, queryArgs, {
    entryName: 'habits.getTracking',
    fallbackToLatest: options.fallbackToLatest,
  });
  const tracking =
    queriedTracking ?? options.fallbackTracking ?? EMPTY_TRACKING;
  const pendingToggles = usePendingToggles();
  const completedDatesByHabit = useMemo(() => {
    return buildCompletedDatesByHabit(tracking, pendingToggles);
  }, [pendingToggles, tracking]);
  const streakByHabit = useMemo(
    () => buildStreakByHabit(completedDatesByHabit, stableToday),
    [completedDatesByHabit, stableToday]
  );
  const getStreak = useCallback(
    (habitId: string) => streakByHabit.get(habitId) ?? 0,
    [streakByHabit]
  );
  // Build the status cache over the full stable window so getHabitStatus keeps
  // a stable identity across in-window navigation (otherwise it churns on every
  // week change, re-rendering the whole habits list a second time).
  const dateStatusCache = useMemo(
    () => buildDateStatusCache(windowDateStrings, stableToday),
    [windowDateStrings, stableToday]
  );

  const getHabitStatus = useCallback(
    (habitId: string, dateString: string): HabitStatus => {
      const normalizedDateString = dateString.trim();
      if (!normalizedDateString) return 'planned';
      const dateStatusInfo = getDateStatusInfo(
        dateStatusCache,
        normalizedDateString,
        stableToday
      );
      if (!dateStatusInfo.isValid) return 'planned';
      if (completedDatesByHabit.get(habitId)?.has(normalizedDateString))
        return 'done';
      return dateStatusInfo.status;
    },
    [completedDatesByHabit, dateStatusCache, stableToday]
  );

  const isCompleted = useCallback(
    (habitId: Id<'habits'>, date: string): boolean =>
      getHabitStatus(habitId, date) === 'done',
    [getHabitStatus]
  );

  return { getHabitStatus, getStreak, isCompleted, tracking };
}
