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
  const { completedDatesByHabit, trackingMap } = useMemo(() => {
    const byHabit = new Map<string, Set<string>>();
    const byKey = new Map<string, (typeof tracking)[number]>();

    // First, process server data
    for (const entry of tracking) {
      if (!entry) continue;
      byKey.set(`${entry.habitId}-${entry.date}`, entry);
      if (!entry.completed) continue;
      if (!byHabit.has(entry.habitId)) {
        byHabit.set(entry.habitId, new Set<string>());
      }
      byHabit.get(entry.habitId)!.add(entry.date);
    }

    // Then, apply optimistic updates
    for (const [key, toCompleted] of optimisticStore.pendingToggles) {
      const [habitId, date] = key.split(':');
      if (!byHabit.has(habitId)) {
        byHabit.set(habitId, new Set<string>());
      }
      if (toCompleted) {
        byHabit.get(habitId)!.add(date);
      } else {
        byHabit.get(habitId)!.delete(date);
      }
    }

    return { completedDatesByHabit: byHabit, trackingMap: byKey };
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

      // Fall back to server state (O(1) Map lookup)
      const entry = trackingMap.get(`${habitId}-${dateString}`);
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
    [today, trackingMap, optimisticStore.pendingToggles]
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
