/**
 * useHabitsListHeaderComputed Hook
 *
 * Extracts computed values for HabitsListHeader to keep the component lean.
 * Computes completion statistics and timeline visibility state.
 */

import { useMemo } from 'react';
import type { DayCompletionStatus } from '../../../../components/CalendarTimeline';
import { useIsOnline } from '../../../../contexts/NetworkStatusContext';

export interface UseHabitsListHeaderComputedProps {
  habits: Array<{ _id: string }>;
  weekDateStrings: string[];
  justCreatedHabitId: string | null;
  getHabitStatus: (habitId: string, dateString: string) => string;
}

export interface UseHabitsListHeaderComputedResult {
  /** Today's date string in ISO format */
  todayString: string;
  /** Number of habits completed today */
  completedToday: number;
  /** Total number of habits */
  totalHabits: number;
  /** Completion status by day for calendar timeline */
  completionByDay: Record<string, DayCompletionStatus>;
  /** Whether the calendar timeline should be shown */
  shouldShowTimeline: boolean;
  /** Whether the device is offline (US3) */
  isOffline: boolean;
}

export function useHabitsListHeaderComputed({
  habits,
  weekDateStrings,
  justCreatedHabitId,
  getHabitStatus,
}: UseHabitsListHeaderComputedProps): UseHabitsListHeaderComputedResult {
  // US3: Detect offline status for visual indicator
  const isOnline = useIsOnline();
  const isOffline = !isOnline;

  const todayString = new Date().toISOString().split('T')[0];
  const totalHabits = habits.length;

  const completedToday = useMemo(
    () =>
      habits.filter((h) => getHabitStatus(h._id, todayString) === 'done')
        .length,
    [habits, getHabitStatus, todayString]
  );

  const completionByDay = useMemo(() => {
    const result: Record<string, DayCompletionStatus> = {};
    for (const dateString of weekDateStrings) {
      result[dateString] = {
        completed: habits.filter(
          (h) => getHabitStatus(h._id, dateString) === 'done'
        ).length,
        total: totalHabits,
      };
    }
    return result;
  }, [habits, weekDateStrings, getHabitStatus, totalHabits]);

  const shouldShowTimeline = totalHabits > 0 || justCreatedHabitId !== null;

  return {
    completedToday,
    completionByDay,
    isOffline,
    shouldShowTimeline,
    todayString,
    totalHabits,
  };
}
