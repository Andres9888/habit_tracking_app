import { useMemo, useCallback } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';
import { useHabitsListState } from './useHabitsListState';
import { useHabitsModalsState } from './useHabitsModalsState';
import { useNotificationResponse } from '../../../hooks/useNotificationResponse';
import { useDeepLinking } from '../../../hooks/useDeepLinking';
import type { UseHabitsAppResult } from './types';

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

  // Handle deep links
  const handleOpenHabit = useCallback(
    (habitId: Id<'habits'>) => {
      const habit = list.habits.find((h) => h._id === habitId);
      if (habit) {
        modals.openHabitDetail(habit);
      }
    },
    [list.habits, modals]
  );

  useDeepLinking({
    onOpenHabit: handleOpenHabit,
    onOpenCreate: modals.openCreateHabitScreen,
    onOpenSettings: modals.openSettings,
    onOpenTemplates: modals.openTemplatesScreen,
  });

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
