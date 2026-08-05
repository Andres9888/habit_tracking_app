/**
 * useMultiMilestoneDetection Hook
 *
 * Tracks milestone achievements across multiple habits simultaneously.
 *
 * @example
 * ```tsx
 * const { milestones, clearMilestone } = useMultiMilestoneDetection(habits);
 *
 * // Show first milestone in queue
 * const currentMilestone = milestones[0];
 * ```
 */

import { useEffect, useRef, useState } from 'react';
import { getStrengthLevel } from '../../components/HabitStrengthIndicator';
import type {
  MilestoneAchievement,
  UseMultiMilestoneDetectionReturn,
} from './types';
import { checkMilestoneCrossed } from './utils';

export function useMultiMilestoneDetection(
  habits: Array<{ id: string; name: string; strength: number }>
): UseMultiMilestoneDetectionReturn {
  const [milestones, setMilestones] = useState<MilestoneAchievement[]>([]);
  const previousStrengthsRef = useRef<Map<string, number>>(new Map());
  const shownMilestonesRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const newMilestones: MilestoneAchievement[] = [];

    for (const habit of habits) {
      const previousStrength = previousStrengthsRef.current.get(habit.id);

      if (previousStrength === undefined) {
        previousStrengthsRef.current.set(habit.id, habit.strength);
        continue;
      }

      const milestoneCrossed = checkMilestoneCrossed(
        previousStrength,
        habit.strength
      );

      if (milestoneCrossed) {
        const newLevel = getStrengthLevel(habit.strength);
        const milestoneKey = `${habit.id}-${newLevel}`;

        if (!shownMilestonesRef.current.has(milestoneKey)) {
          shownMilestonesRef.current.add(milestoneKey);
          newMilestones.push({
            habitId: habit.id,
            habitName: habit.name,
            level: newLevel,
            previousStrength,
            strength: habit.strength,
          });
        }
      }

      previousStrengthsRef.current.set(habit.id, habit.strength);
    }

    if (newMilestones.length > 0) {
      setMilestones((prev) => [...prev, ...newMilestones]);
    }
  }, [habits]);

  const clearMilestone = (habitId: string) => {
    setMilestones((prev) => prev.filter((m) => m.habitId !== habitId));
  };

  return { clearMilestone, milestones };
}
