import { useMemo } from 'react';
import { useHabitsListState } from './useHabitsListState';
import { useHabitsModalsState } from './useHabitsModalsState';
import { useNotificationResponse } from '../../../hooks/useNotificationResponse';
import type { UseHabitsAppResult } from './types';

// Re-export types for component imports

export function useHabitsApp(): UseHabitsAppResult {
  const list = useHabitsListState();
  const modals = useHabitsModalsState({
    habits: list.habits,
    showHabitStrengthPercentage: list.showHabitStrengthPercentage,
  });

  // Route notification taps to the activation modal
  const notificationHandlers = useMemo(
    () => ({
      onHabitNotificationTap: (habitId: string) => {
        modals.openActivationModalById(habitId);
      },
    }),
    [modals.openActivationModalById]
  );
  useNotificationResponse(notificationHandlers);

  // Tapping a habit opens the redesigned Habit Detail Screen
  return {
    list: { ...list, handleHabitPress: modals.openHabitDetail },
    modals,
  };
}

export {
  type HabitsListState,
  type HabitsModalsState,
  type LastUpdatedHabit,
} from './types';
