import { useCallback, useEffect, useRef, useState } from 'react';

import type { Habit } from '../types';
import { useMilestoneDetection } from '../../../hooks/useMilestoneDetection';

export function useHabitMilestones(habits: Habit[], isLoading: boolean) {
  const [lastUpdatedHabit, setLastUpdatedHabit] = useState<{
    id: string;
    name: string;
    strength: number;
  } | null>(null);

  const { milestone, clearMilestone } = useMilestoneDetection(
    lastUpdatedHabit?.id,
    lastUpdatedHabit?.name,
    lastUpdatedHabit ? lastUpdatedHabit.strength * 100 : undefined
  );

  const previousStrengthsRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    if (isLoading) {
      return;
    }

    for (const habit of habits) {
      const previousStrength = previousStrengthsRef.current.get(habit._id) ?? 0;
      const currentStrength = habit.strength ?? 0;

      if (currentStrength > previousStrength) {
        setLastUpdatedHabit({
          id: habit._id,
          name: habit.name,
          strength: currentStrength,
        });
      }

      previousStrengthsRef.current.set(habit._id, currentStrength);
    }
  }, [habits, isLoading]);

  useEffect(() => {
    // milestone detected - celebration UI handles display
  }, [milestone]);

  // Returned as `clearMilestone`, which is a dependency of the memoised
  // `modals` object in useHabitsModalsState (and of the handlers built from
  // it). A fresh closure per render would defeat both memos.
  const resetMilestone = useCallback(() => {
    clearMilestone();
    setLastUpdatedHabit(null);
  }, [clearMilestone]);

  return { clearMilestone: resetMilestone, milestone };
}
