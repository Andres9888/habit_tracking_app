import { useCallback, useMemo, useRef } from 'react';

import { api } from '../../../../convex/_generated/api';
import { useCachedQuery } from '../../../lib/queryCache';
import type { Id } from '../../../../convex/_generated/dataModel';
import { usePendingToggles } from '../../../lib/optimistic';
import type { HabitStatus } from '../types';
import { buildCompletedDatesByHabit } from './useHabitsTracking.completions';
import type { StreakSourceHabit } from './useResolvedStreaks';
import { useResolvedStreaks } from './useResolvedStreaks';
import {
  buildDateStatusCache,
  buildTrackingQueryArgs,
  getDateStatusInfo,
  normalizeToday,
} from './useHabitsTracking.helpers';
import { useTrackingWindow } from './useTrackingWindow';

// Module-level constant: a fresh [] default would change identity every render
// and bust the server-streak memo in useResolvedStreaks.
const NO_HABITS: readonly StreakSourceHabit[] = [];

export interface UseHabitsTrackingOptions {
  /**
   * When false the Convex subscription is skipped entirely: tracking resolves
   * to the shared empty array and every streak reads 0. Used by the modals
   * instance, whose consumers (calendar modal, detail screen, quick actions)
   * are closed for most of a session.
   */
  enabled?: boolean;
  /**
   * Forwarded to useCachedQuery. Pass false for secondary subscribers so they
   * never overwrite the shared `habits.getTracking:latest` slot owned by the
   * habits list.
   */
  writeLatest?: boolean;
}

// Module-scoped so a skipped/loading subscription returns the *same* array on
// every render; a fresh `[]` would bust every downstream useMemo.
const EMPTY_TRACKING: never[] = [];

export function useHabitsTracking(
  extendedDateStrings: string[],
  today: Date,
  habits: readonly StreakSourceHabit[] = NO_HABITS,
  options: UseHabitsTrackingOptions = {}
) {
  const { enabled = true, writeLatest } = options;
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
    () => (enabled ? buildTrackingQueryArgs(windowStart, windowEnd) : 'skip'),
    [enabled, windowStart, windowEnd]
  );
  const trackingQuery = useCachedQuery(api.habits.getTracking, queryArgs, {
    entryName: 'habits.getTracking',
    writeLatest,
  });
  const tracking = trackingQuery ?? EMPTY_TRACKING;
  const pendingToggles = usePendingToggles();
  // Feeding the previous result back in lets unchanged habits keep their Set
  // identity, which is what makes the streak cache hit for everything except
  // the habit that was actually toggled.
  const previousCompletedDatesRef = useRef<
    Map<string, Set<string>> | undefined
  >(undefined);
  const completedDatesByHabit = useMemo(() => {
    const next = buildCompletedDatesByHabit(
      tracking,
      pendingToggles,
      previousCompletedDatesRef.current
    );
    previousCompletedDatesRef.current = next;
    return next;
  }, [pendingToggles, tracking]);
  // The client count is truncated by the fetched window and blind to pauses;
  // useResolvedStreaks falls back to the server streak in exactly those cases.
  const streakByHabit = useResolvedStreaks(
    completedDatesByHabit,
    stableToday,
    habits,
    windowStart
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
