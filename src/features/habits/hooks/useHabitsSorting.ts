
import { useMemo } from 'react';

import type { Habit, HabitSortMode } from '../types';

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
  return useMemo(() => {
    if (habitSortMode === 'manual') {
      return habitsFromQuery;
    }

    const sortedHabits = [...habitsFromQuery];

    if (habitSortMode === 'day_phase') {
      return sortByDayPhase(sortedHabits);
    }

    if (habitSortMode === 'name_asc' || habitSortMode === 'name_desc') {
      return sortByName(sortedHabits, habitSortMode);
    }

    if (habitSortMode === 'strength_asc' || habitSortMode === 'strength_desc') {
      return sortByStrength(sortedHabits, habitSortMode);
    }

    return sortByStreak(sortedHabits, habitSortMode, getStreak);
  }, [getStreak, habitSortMode, habitsFromQuery]);
}

function sortByDayPhase(habits: Habit[]): Habit[] {
  const phaseOrder: Record<string, number> = {
    afternoon: 1,
    evening: 2,
    morning: 0,
    phase1_push: 0,
    phase2_pivot: 1,
    phase3_pull: 2,
  };

  return habits.sort((a, b) => {
    const aPhase = a.preferredTime ? (phaseOrder[a.preferredTime] ?? 99) : 99;
    const bPhase = b.preferredTime ? (phaseOrder[b.preferredTime] ?? 99) : 99;

    if (aPhase !== bPhase) {
      return aPhase - bPhase;
    }

    return compareNames(a.name, b.name);
  });
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

function compareNames(nameA: string, nameB: string): number {
  const normalizedA = nameA.trim().toLowerCase();
  const normalizedB = nameB.trim().toLowerCase();
  if (normalizedA === normalizedB) return 0;
  return normalizedA < normalizedB ? -1 : 1;
}
