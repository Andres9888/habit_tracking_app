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
    homeTracking: list.tracking,
    settings: list.settings,
    showHabitStrengthPercentage: list.showHabitStrengthPercentage,
  });

  // Route push-notification taps to the tapped habit's Habit Detail Screen.
  const { openHabitDetail } = modals;
  const notificationHandlers = useMemo(
    () => ({
      onHabitNotificationTap: (habitId: string) => {
        const habit = list.habits.find((h) => h._id === habitId);
        if (habit) {
          openHabitDetail(habit);
        }
      },
    }),
    [list.habits, openHabitDetail]
  );
  useNotificationResponse(notificationHandlers);

  // Tapping a habit row opens the redesigned Habit Detail Screen.
  // Memoised so the `handleHabitPress` override doesn't allocate a fresh `list`
  // wrapper on every render — only when `list` or `openHabitDetail` change.
  return useMemo(
    () => ({
      list: { ...list, handleHabitPress: openHabitDetail },
      modals,
    }),
    [list, openHabitDetail, modals]
  );
}

export {
  type HabitsListState,
  type HabitsModalsState,
  type LastUpdatedHabit,
} from './types';
