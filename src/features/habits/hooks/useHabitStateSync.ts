import { useEffect } from 'react';
import type { Habit } from '../types';

/**
 * Syncs a habit state snapshot when the habits array updates
 * Used to keep modal/screen state in sync with the source of truth
 */
export function useHabitStateSync(
  habits: Habit[],
  currentHabit: Habit | null,
  setHabit: (habit: Habit) => void,
  debugLabel?: string
) {
  useEffect(() => {
    if (!currentHabit) return;

    const updated = habits.find((h) => h._id === currentHabit._id);
    if (!updated) return;

    const streakChanged = updated.currentStreak !== currentHabit.currentStreak;
    const strengthChanged = updated.strength !== currentHabit.strength;
    const referenceChanged = updated !== currentHabit;

    if (streakChanged || strengthChanged || referenceChanged) {
      if (__DEV__ && debugLabel) {
        // eslint-disable-next-line no-console
        console.log(`🔄 Syncing ${debugLabel}:`, {
          habitName: updated.name,
          streakChanged,
          strengthChanged,
        });
      }
      setHabit(updated);
    }
  }, [habits, currentHabit, setHabit, debugLabel]);
}
