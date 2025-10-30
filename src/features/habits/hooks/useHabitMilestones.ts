import { useEffect, useRef, useState } from 'react';

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

    habits.forEach((habit) => {
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
    });
  }, [habits, isLoading]);

  useEffect(() => {
    if (milestone) {
      console.log('🎉 MILESTONE DETECTED!', {
        level: milestone.level,
        strength: `${milestone.strength}%`,
        habitName: milestone.habitName,
      });
    }
  }, [milestone]);

  const resetMilestone = () => {
    clearMilestone();
    setLastUpdatedHabit(null);
  };

  return { milestone, clearMilestone: resetMilestone };
}
