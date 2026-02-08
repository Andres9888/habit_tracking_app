import { useEffect, useRef } from 'react';
import type { Habit } from '../types';

/**
 * Syncs a habit state snapshot when the habits array updates
 * Used to keep modal/screen state in sync with the source of truth
 * 
 * Only syncs when actual tracked values change (streak, strength)
 * to avoid infinite loops from reference changes
 */
export function useHabitStateSync(
  habits: Habit[],
  currentHabit: Habit | null,
  setHabit: (habit: Habit) => void,
  debugLabel?: string
) {
  // Use ref for setHabit to prevent it from triggering useEffect re-runs
  const setHabitRef = useRef(setHabit);
  setHabitRef.current = setHabit;

  // Track previous values to detect actual changes
  const prevValuesRef = useRef<{
    id: string | null;
    streak: number | undefined;
    strength: number | undefined;
  }>({ id: null, streak: undefined, strength: undefined });

  useEffect(() => {
    if (!currentHabit) {
      prevValuesRef.current = { id: null, streak: undefined, strength: undefined };
      return;
    }

    const updated = habits.find((h) => h._id === currentHabit._id);
    if (!updated) return;

    // Only check for actual value changes, not reference changes
    const streakChanged = updated.currentStreak !== currentHabit.currentStreak;
    const strengthChanged = updated.strength !== currentHabit.strength;

    // Track if values changed from last sync (not from currentHabit which may be stale)
    const idChanged = prevValuesRef.current.id !== updated._id;
    const prevStreakChanged = prevValuesRef.current.streak !== updated.currentStreak;
    const prevStrengthChanged = prevValuesRef.current.strength !== updated.strength;

    // Only sync if meaningful values changed
    if (idChanged || prevStreakChanged || prevStrengthChanged) {


      // Update tracking ref before calling setHabit to prevent re-sync
      prevValuesRef.current = {
        id: updated._id,
        streak: updated.currentStreak,
        strength: updated.strength,
      };

      setHabitRef.current(updated);
    }
  }, [habits, currentHabit, debugLabel]);
}
