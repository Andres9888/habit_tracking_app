import { getLocalDateString } from '@/utils/getLocalDateString';
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
  todayString: string;
  completedToday: number;
  totalHabits: number;
  completionByDay: Record<string, DayCompletionStatus>;
  shouldShowTimeline: boolean;
  isOffline: boolean;
}

export function useHabitsListHeaderComputed({
  habits,
  weekDateStrings,
  justCreatedHabitId,
  getHabitStatus,
}: UseHabitsListHeaderComputedProps): UseHabitsListHeaderComputedResult {
  const isOnline = useIsOnline();
  const isOffline = !isOnline;
  const todayString = getLocalDateString();
  const totalHabits = habits.length;

  const { completedToday, completionByDay } = useMemo(() => {
    const result: Record<string, DayCompletionStatus> = {};
    for (const dateString of weekDateStrings) {
      result[dateString] = { completed: 0, total: totalHabits };
    }
    let todayCompleted = 0;
    for (const habit of habits) {
      if (getHabitStatus(habit._id, todayString) === 'done')
        todayCompleted += 1;
      for (const dateString of weekDateStrings) {
        if (getHabitStatus(habit._id, dateString) === 'done') {
          result[dateString].completed += 1;
        }
      }
    }
    return { completedToday: todayCompleted, completionByDay: result };
  }, [habits, weekDateStrings, getHabitStatus, todayString, totalHabits]);

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
