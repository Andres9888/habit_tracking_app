/**
 * Habits hook types — barrel file.
 *
 * Re-exports list and modal state interfaces so consumers can import
 * from a single path (`./hooks/types`).
 */

/** Metadata for the most recently toggled habit (used by reward toast). */
export interface LastUpdatedHabit {
  id: string;
  name: string;
  strength: number;
}

export type { HabitsListState } from './habitsListState.types';
export type { HabitsModalsState } from './habitsModalsState.types';

/** Combined return type of `useHabitsApp`. */
export interface UseHabitsAppResult {
  list: import('./habitsListState.types').HabitsListState;
  modals: import('./habitsModalsState.types').HabitsModalsState;
}
