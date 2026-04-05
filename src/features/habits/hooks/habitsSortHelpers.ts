/**
 * Pure sorting functions for habits list.
 * Extracted from useHabitsSorting for the 100-line limit.
 */

import type { Habit, HabitSortMode } from '../types';

export function sortByName(
  habits: Habit[],
  mode: 'name_asc' | 'name_desc'
): Habit[] {
  const direction = mode === 'name_asc' ? 1 : -1;
  return habits.sort((a, b) => compareNames(a.name, b.name) * direction);
}

export function sortByStrength(
  habits: Habit[],
  mode: 'strength_asc' | 'strength_desc'
): Habit[] {
  const direction = mode === 'strength_desc' ? -1 : 1;
  return habits.sort((a, b) => {
    const aStrength = a.strength ?? 0;
    const bStrength = b.strength ?? 0;
    if (aStrength !== bStrength) {
      return (aStrength - bStrength) * direction;
    }
    return compareNames(a.name, b.name);
  });
}

export function sortByStreak(
  habits: Habit[],
  mode: HabitSortMode,
  getStreak: (habitId: string) => number
): Habit[] {
  const streakByHabitId = new Map(
    habits.map((habit) => [
      habit._id,
      habit.currentStreak ?? getStreak(habit._id),
    ])
  );

  const direction = mode === 'streak_desc' ? -1 : 1;
  return habits.sort((a, b) => {
    const aStreak = streakByHabitId.get(a._id) ?? 0;
    const bStreak = streakByHabitId.get(b._id) ?? 0;
    if (aStreak !== bStreak) {
      return (aStreak - bStreak) * direction;
    }
    return compareNames(a.name, b.name);
  });
}

function compareNames(nameA: string, nameB: string): number {
  const a = nameA.trim().toLowerCase();
  const b = nameB.trim().toLowerCase();
  if (a === b) return 0;
  return a < b ? -1 : 1;
}
