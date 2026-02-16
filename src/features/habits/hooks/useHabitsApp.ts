/**
 * useHabitsApp — top-level composition hook for the habits screen.
 *
 * Combines list state (`useHabitsListState`), modal state
 * (`useHabitsModalsState`), and notification routing into a single
 * `UseHabitsAppResult` consumed by `HabitsAppContent`.
 *
 * This hook owns no UI state itself; it wires sub-hooks together and
 * patches `list.handleHabitPress` to open the habit-detail screen.
 */

import { useMemo } from 'react';
import { useHabitsListState } from './useHabitsListState';
import { useHabitsModalsState } from './useHabitsModalsState';
import { useNotificationResponse } from '../../../hooks/useNotificationResponse';
import type { UseHabitsAppResult } from './types';

export function useHabitsApp(): UseHabitsAppResult {
  const list = useHabitsListState();
  const modals = useHabitsModalsState({
    habits: list.habits,
    showHabitStrengthPercentage: list.showHabitStrengthPercentage,
  });

  // Route push-notification taps to the activation modal for the tapped habit.
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

  // Tapping a habit row opens the redesigned Habit Detail Screen.
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
