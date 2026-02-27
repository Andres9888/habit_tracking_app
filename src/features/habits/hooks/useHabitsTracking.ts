import { useCallback, useMemo } from 'react';
import { useQuery } from 'convex/react';

import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import { computeCurrentStreakFromDates } from '../../../utils/streak';
import { useOptimisticStore } from '../../../lib/optimistic';
import { validateDateString } from '../../../utils/validation';
import type { HabitStatus } from '../types';

type PlannedStatus = Exclude<HabitStatus, 'done'>;

type DateStatusInfo = {
  isValid: boolean;
  status: PlannedStatus;
};

function computeDateStatusInfo(dateString: string, today: Date): DateStatusInfo {
  const validation = validateDateString(dateString);
  if (!validation.isValid) {
    if (__DEV__) {
      console.warn(`Invalid date string: ${dateString}`, validation.error);
    }
    return { isValid: false, status: 'planned' };
  }

  const parts = dateString.split('-').map(Number);
  const year = parts[0] ?? 0;
  const month = parts[1] ?? 1;
  const day = parts[2] ?? 1;
  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
    if (__DEV__) {
      console.warn(`Non-numeric date parts: ${dateString}`);
    }
    return { isValid: false, status: 'planned' };
  }

  const parsedDate = new Date(year, month - 1, day);
  parsedDate.setHours(0, 0, 0, 0);
  if (Number.isNaN(parsedDate.getTime())) {
    if (__DEV__) {
      console.warn(`Invalid date created from: ${dateString}`);
    }
    return { isValid: false, status: 'planned' };
  }

  return {
    isValid: true,
    status: parsedDate < today ? 'missed' : 'planned',
  };
}

export function useHabitsTracking(extendedDateStrings: string[], today: Date) {
  const stableToday = useMemo(() => {
    const normalizedToday = new Date(today);
    normalizedToday.setHours(0, 0, 0, 0);
    return normalizedToday;
  }, [today.getDate(), today.getFullYear(), today.getMonth()]);

  // Use startDate/endDate range instead of sending all 365 date strings
  // This reduces the Convex query argument payload from ~4KB to ~50 bytes
  // Sort to handle arrays in either chronological or reverse order
  const queryArgs = useMemo(() => {
    const first = extendedDateStrings?.[0];
    const last = extendedDateStrings?.at(-1);
    const startDate = first && last && first < last ? first : last;
    const endDate = first && last && first < last ? last : first;
    return startDate && endDate
      ? { endDate, startDate }
      : { dates: extendedDateStrings };
  }, [extendedDateStrings]);

  const tracking = useQuery(api.habits.getTracking, queryArgs) ?? [];

  // Get optimistic state for immediate feedback
  const optimisticStore = useOptimisticStore();

  // Merge server tracking with optimistic updates
  const completedDatesByHabit = useMemo(() => {
    const map = new Map<string, Set<string>>();

    // First, process server data
    for (const entry of tracking) {
      if (!entry || !entry.completed) continue;
      if (!map.has(entry.habitId)) {
        map.set(entry.habitId, new Set<string>());
      }
      map.get(entry.habitId)?.add(entry.date);
    }

    // Then, apply optimistic updates
    for (const [key, toCompleted] of optimisticStore.pendingToggles) {
      const [habitId = '', date = ''] = key.split(':');
      if (!map.has(habitId)) {
        map.set(habitId, new Set<string>());
      }
      if (toCompleted) {
        map.get(habitId)?.add(date);
      } else {
        map.get(habitId)?.delete(date);
      }
    }

    return map;
  }, [tracking, optimisticStore.pendingToggles]);

  const streakByHabit = useMemo(() => {
    const map = new Map<string, number>();
    for (const [habitId, completedDates] of completedDatesByHabit) {
      map.set(habitId, computeCurrentStreakFromDates(completedDates, stableToday));
    }
    return map;
  }, [completedDatesByHabit, stableToday]);

  const getStreak = useCallback(
    (habitId: string) => streakByHabit.get(habitId) ?? 0,
    [streakByHabit]
  );

  const dateStatusCache = useMemo(() => {
    const cache = new Map<string, DateStatusInfo>();
    for (const dateString of extendedDateStrings) {
      const normalizedDateString = dateString.trim();
      if (!normalizedDateString || cache.has(normalizedDateString)) continue;
      cache.set(
        normalizedDateString,
        computeDateStatusInfo(normalizedDateString, stableToday)
      );
    }
    return cache;
  }, [extendedDateStrings, stableToday]);

  const getHabitStatus = useCallback(
    (habitId: string, dateString: string): HabitStatus => {
      const normalizedDateString = dateString.trim();
      if (!normalizedDateString) {
        return 'planned';
      }

      let dateStatusInfo = dateStatusCache.get(normalizedDateString);
      if (!dateStatusInfo) {
        dateStatusInfo = computeDateStatusInfo(normalizedDateString, stableToday);
        dateStatusCache.set(normalizedDateString, dateStatusInfo);
      }

      if (!dateStatusInfo.isValid) {
        return 'planned';
      }

      // Use the pre-built map (includes optimistic merges) for O(1) lookup
      const completedDates = completedDatesByHabit.get(habitId);
      if (completedDates?.has(normalizedDateString)) {
        return 'done';
      }

      return dateStatusInfo.status;
    },
    [stableToday, completedDatesByHabit, dateStatusCache]
  );

  /**
   * Get whether a habit/date is currently completed (for optimistic toggle)
   */
  const isCompleted = useCallback(
    (habitId: Id<'habits'>, date: string): boolean => {
      return getHabitStatus(habitId, date) === 'done';
    },
    [getHabitStatus]
  );

  return {
    getHabitStatus,
    getStreak,
    isCompleted,
    tracking: tracking,
  };
}
