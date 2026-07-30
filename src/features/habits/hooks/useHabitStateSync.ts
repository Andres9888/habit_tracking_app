import { useEffect, useRef } from 'react';
import type { Habit } from '../types';

/**
 * Syncs a habit state snapshot when the habits array updates
 * Used to keep modal/screen state in sync with the source of truth
 *
 * Only syncs when actual tracked values change (streak, strength, name, icon, color)
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
    name: string | undefined;
    icon: string | undefined;
    color: string | undefined;
    iconColor: string | undefined;
    effortMinutes: number | undefined;
    goalDuration: number | undefined;
  }>({
    id: null,
    streak: undefined,
    strength: undefined,
    name: undefined,
    icon: undefined,
    color: undefined,
    iconColor: undefined,
    effortMinutes: undefined,
    goalDuration: undefined,
  });

  useEffect(() => {
    if (!currentHabit) {
      prevValuesRef.current = {
        id: null,
        streak: undefined,
        strength: undefined,
        name: undefined,
        icon: undefined,
        color: undefined,
        iconColor: undefined,
        effortMinutes: undefined,
        goalDuration: undefined,
      };
      return;
    }

    const updated = habits.find((h) => h._id === currentHabit._id);
    if (!updated) return;

    // Track if values changed from last sync (not from currentHabit which may be stale)
    const idChanged = prevValuesRef.current.id !== updated._id;
    const prevStreakChanged = prevValuesRef.current.streak !== updated.currentStreak;
    const prevStrengthChanged = prevValuesRef.current.strength !== updated.strength;
    const prevNameChanged = prevValuesRef.current.name !== updated.name;
    const prevIconChanged = prevValuesRef.current.icon !== updated.icon;
    const prevColorChanged = prevValuesRef.current.color !== updated.color;
    const prevIconColorChanged = prevValuesRef.current.iconColor !== updated.iconColor;
    const prevEffortMinutesChanged = prevValuesRef.current.effortMinutes !== updated.effortMinutes;
    const prevGoalDurationChanged = prevValuesRef.current.goalDuration !== updated.goalDuration;

    // Only sync if meaningful values changed
    if (
      idChanged ||
      prevStreakChanged ||
      prevStrengthChanged ||
      prevNameChanged ||
      prevIconChanged ||
      prevColorChanged ||
      prevIconColorChanged ||
      prevEffortMinutesChanged ||
      prevGoalDurationChanged
    ) {
      // Update tracking ref before calling setHabit to prevent re-sync
      prevValuesRef.current = {
        id: updated._id,
        streak: updated.currentStreak,
        strength: updated.strength,
        name: updated.name,
        icon: updated.icon,
        color: updated.color,
        iconColor: updated.iconColor,
        effortMinutes: updated.effortMinutes,
        goalDuration: updated.goalDuration,
      };

      setHabitRef.current(updated);
    }
  }, [habits, currentHabit, debugLabel]);
}
