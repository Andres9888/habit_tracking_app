import { useCallback, useMemo, useRef } from 'react';

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
  retainLastResult?: boolean;
}

export function useHabitsTracking(
  extendedDateStrings: string[],
  today: Date,
  {
    enabled = true,
    retainLastResult = false,
  }: UseHabitsTrackingOptions = {}
) {
  const stableToday = useMemo(
    () => normalizeToday(today),
    [today.getDate(), today.getFullYear(), today.getMonth()]
  );
  // Query a stable buffered window instead of the shifting visible range, so
  // week navigation within the buffer reuses the same subscription.
  const { windowStart, windowEnd, windowDateStrings } = useTrackingWindow(
    extendedDateStrings,
    stableToday
  );
  const queryArgs = useMemo(
    () => buildTrackingQueryArgs(windowStart, windowEnd),
    [windowStart, windowEnd]
  );
  const liveTracking = useCachedQuery(
    api.habits.getTracking,
    enabled ? queryArgs : 'skip',
    {
      entryName: 'habits.getTracking',
    }
  );
  const lastTrackingRef = useRef<HabitTrackingEntry[]>([]);
  if (retainLastResult && liveTracking !== undefined) {
    lastTrackingRef.current = liveTracking;
  }
  // Modal consumers keep their last snapshot through exit animations, while
  // the main list preserves its existing empty fallback during a cache miss.
  const tracking =
    liveTracking ?? (retainLastResult ? lastTrackingRef.current : []);
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
