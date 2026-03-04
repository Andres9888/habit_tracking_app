/**
 * useBottomBarProps — computes props for the BottomActionBar.
 *
 * Centralises the add-habit and action callbacks so HabitsApp stays under
 * the line limit. Also derives today's completion count for the progress ring.
 */

import { useCallback, useMemo } from 'react';
import { getLocalDateString } from '@/utils/getLocalDateString';
import type { HabitsModalsState } from './hooks/types';
import type { HabitStatus } from './types';

interface UseBottomBarPropsOptions {
  modals: HabitsModalsState;
  handleCreateHabitRequest: () => void | Promise<void>;
  habits: Array<{ _id: string }>;
  getHabitStatus: (habitId: string, dateString: string) => HabitStatus;
  reduceMotion: boolean;
  onLongPressSettings?: () => void;
}

export function useBottomBarProps({
  modals,
  handleCreateHabitRequest,
  habits,
  getHabitStatus,
  reduceMotion,
  onLongPressSettings,
}: UseBottomBarPropsOptions) {
  const onAddHabitPress = useCallback((): void => {
    void handleCreateHabitRequest();
  }, [handleCreateHabitRequest]);

  const todayString = getLocalDateString();
  const completedToday = useMemo(() => {
    let count = 0;
    for (const habit of habits) {
      if (getHabitStatus(habit._id, todayString) === 'done') count += 1;
    }
    return count;
  }, [habits, getHabitStatus, todayString]);

  return {
    completedToday,
    totalHabits: habits.length,
    reduceMotion,
    onAddHabit: onAddHabitPress,
    onOpenSettings: modals.openSettings,
    onOpenTemplates: modals.openTemplatesScreen,
    onLongPressSettings,
  };
}
