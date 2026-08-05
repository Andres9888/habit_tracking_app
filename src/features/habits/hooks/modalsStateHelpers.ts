import { getLocalDateString } from '@/utils/getLocalDateString';
/**
 * Helper utilities for useHabitsModalsState
 */

import type { Habit } from '../types';
import type { useHabitSelectionState } from './useHabitSelectionState';
import { useHabitStateSync } from './useHabitStateSync';

export function generateDateStrings(days: number): string[] {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return getLocalDateString(date);
  });
}

export function getTodayMidnight(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function useSyncAllHabitStates(
  habits: Habit[],
  sel: ReturnType<typeof useHabitSelectionState>
): void {
  useHabitStateSync(
    habits,
    sel.selectedHabit,
    sel.setSelectedHabit,
    'selectedHabit'
  );
  useHabitStateSync(habits, sel.habitToEdit, sel.setHabitToEdit);
  useHabitStateSync(habits, sel.habitToPause, sel.setHabitToPause);
  useHabitStateSync(habits, sel.quickActionsHabit, sel.setQuickActionsHabit);
}
