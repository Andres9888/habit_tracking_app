import { useMemo } from 'react';
import type { Habit, HabitSortMode } from '../types';
import { useStableSortOrder } from './useStableSortOrder';

interface UseHabitsSortingParams {
  habitsFromQuery: Habit[];
  habitSortMode: HabitSortMode;
  getStreak: (habitId: string) => number;
}

export function useHabitsSorting({
  habitsFromQuery,
  habitSortMode,
  getStreak,
}: UseHabitsSortingParams): Habit[] {
  const sorted = useMemo(() => {
    if (habitSortMode === 'manual') {
      return habitsFromQuery;
    }

    const sortedHabits = [...habitsFromQuery];

    if (habitSortMode === 'name_asc' || habitSortMode === 'name_desc') {
      return sortByName(sortedHabits, habitSortMode);
    }

    if (habitSortMode === 'strength_asc' || habitSortMode === 'strength_desc') {
      return sortByStrength(sortedHabits, habitSortMode);
    }

    return sortByStreak(sortedHabits, habitSortMode, getStreak);
  }, [getStreak, habitSortMode, habitsFromQuery]);

  // Streak/strength keys move on every toggle; hold the order for the session
  // so completing a habit never relocates its row (see useStableSortOrder).
  return useStableSortOrder(sorted, habitSortMode);
}

function sortByName(habits: Habit[], mode: 'name_asc' | 'name_desc'): Habit[] {
  const direction = mode === 'name_asc' ? 1 : -1;
  return habits.sort((a, b) => compareNames(a.name, b.name) * direction);
}

function sortByStrength(
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

function sortByStreak(
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

const nameCollator = new Intl.Collator(undefined, {
  sensitivity: 'base',
  usage: 'sort',
});

function compareNames(nameA: string, nameB: string): number {
  return nameCollator.compare(nameA.trim(), nameB.trim());
}
