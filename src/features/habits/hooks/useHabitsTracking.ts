import { useCallback, useMemo } from 'react';
import { useQuery } from 'convex/react';

import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import { computeCurrentStreakFromDates } from '../../../utils/streak';
import { useOptimisticStore } from '../../../lib/optimistic';
import type { HabitStatus } from '../types';

export function useHabitsTracking(extendedDateStrings: string[], today: Date) {
  // Use startDate/endDate range instead of sending all 365 date strings
  // This reduces the Convex query argument payload from ~4KB to ~50 bytes
  const startDate = extendedDateStrings[0];
  const endDate = extendedDateStrings.at(-1);
  const tracking =
    useQuery(
      api.habits.getTracking,
      startDate && endDate
        ? { endDate, startDate }
        : { dates: extendedDateStrings }
    ) ?? [];

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
      map.get(entry.habitId)!.add(entry.date);
    }

    // Then, apply optimistic updates
    for (const [key, toCompleted] of optimisticStore.pendingToggles) {
      const [habitId, date] = key.split(':');
      if (!map.has(habitId)) {
        map.set(habitId, new Set<string>());
      }
      if (toCompleted) {
        map.get(habitId)!.add(date);
      } else {
        map.get(habitId)!.delete(date);
      }
    }

    return map;
  }, [tracking, optimisticStore.pendingToggles]);

  const getStreak = useCallback(
    (habitId: string) => {
      const completedDates = completedDatesByHabit.get(habitId);
      if (!completedDates) return 0;
      return computeCurrentStreakFromDates(completedDates, today);
    },
    [completedDatesByHabit, today]
  );

  const getHabitStatus = useCallback(
    (habitId: string, dateString: string): HabitStatus => {
      // Use the pre-built map (includes optimistic merges) for O(1) lookup
      const completedDates = completedDatesByHabit.get(habitId);
      if (completedDates?.has(dateString)) {
        return 'done';
      }

      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      date.setHours(0, 0, 0, 0);

      if (date < today) {
        return 'missed';
      }
      return 'planned';
    },
    [today, completedDatesByHabit]
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
