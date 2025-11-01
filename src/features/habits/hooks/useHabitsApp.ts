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

  // Ensure tapping a habit opens the calendar view as the habit details
  return { list: { ...list, handleHabitPress: modals.openHabitCalendar }, modals };
}
