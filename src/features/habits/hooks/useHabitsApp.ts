
import { useMemo } from 'react';

import type { UseHabitsAppResult } from './types';
import { useHabitsListState } from './useHabitsListState';
import { useHabitsModalsState } from './useHabitsModalsState';
import { useNotificationResponse } from '../../../hooks/useNotificationResponse';

// Re-export types for component imports

export function useHabitsApp(): UseHabitsAppResult {
  const list = useHabitsListState();
  const modals = useHabitsModalsState({
    habits: list.habits,
    showHabitStrengthPercentage: list.showHabitStrengthPercentage,
  });

  // Route notification taps to the activation modal
  const { openActivationModalById } = modals;
  const notificationHandlers = useMemo(
    () => ({
      onHabitNotificationTap: (habitId: string) => {
        openActivationModalById(habitId);
      },
    }),
    [openActivationModalById]
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
