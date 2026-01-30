/**
 * Habits Hooks Types - Barrel Export
 */

export interface LastUpdatedHabit {
  id: string;
  name: string;
  strength: number;
}

export type { HabitsListState } from './habitsListState.types';
export type { HabitsModalsState } from './habitsModalsState.types';

export interface UseHabitsAppResult {
  list: import('./habitsListState.types').HabitsListState;
  modals: import('./habitsModalsState.types').HabitsModalsState;
}
