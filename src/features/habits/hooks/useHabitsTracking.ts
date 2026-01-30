import { useCallback, useMemo } from 'react';
import { useQuery } from 'convex/react';

import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import { computeCurrentStreakFromDates } from '../../../utils/streak';
import { useOptimisticStore } from '../../../lib/optimistic';
import type { HabitStatus } from '../types';

export function useHabitsTracking(extendedDateStrings: string[], today: Date) {
  const tracking =
    useQuery(api.habits.getTracking, { dates: extendedDateStrings }) ?? [];

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
      // Check optimistic state first for immediate feedback
      const optimisticKey = `${habitId}:${dateString}`;
      const pendingToggle = optimisticStore.pendingToggles.get(optimisticKey);
      if (pendingToggle !== undefined) {
        return pendingToggle ? 'done' : 'missed';
      }

      // Fall back to server state
      const entry = tracking.find(
        (item) => item && item.habitId === habitId && item.date === dateString
      );

      if (entry?.completed) {
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
    [today, tracking, optimisticStore.pendingToggles]
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
