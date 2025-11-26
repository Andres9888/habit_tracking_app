import { useHabitsListState } from './useHabitsListState';
import { useHabitsModalsState } from './useHabitsModalsState';
import type {
  UseHabitsAppResult,
  HabitsListState,
  HabitsModalsState,
  LastUpdatedHabit
} from './types';

// Re-export types for component imports
export type { HabitsListState, HabitsModalsState, LastUpdatedHabit };

export function useHabitsApp(): UseHabitsAppResult {
  const list = useHabitsListState();
  const modals = useHabitsModalsState({
    habits: list.habits,
    showHabitStrengthPercentage: list.showHabitStrengthPercentage,
  });

  // Tapping a habit opens the redesigned Habit Detail Screen
  return { list: { ...list, handleHabitPress: modals.openHabitDetail }, modals };
}
