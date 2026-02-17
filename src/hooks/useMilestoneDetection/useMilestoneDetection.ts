/**
 * useMilestoneDetection Hook
 *
 * Detects when a habit crosses a milestone threshold (20%, 40%, 60%, 80%)
 *
 * Purpose: Trigger MilestoneCelebration modal when user achieves new strength level
 * Logic: Compares previous and current strength to detect level-up crossing
 * Integration: Used in habit completion flow and strength calculation updates
 *
 * @example
 * ```tsx
 * const { milestone, clearMilestone } = useMilestoneDetection(habitId, habitName, strength);
 *
 * if (milestone) {
 *   <MilestoneCelebration
 *     visible={true}
 *     level={milestone.level}
 *     strength={milestone.strength}
 *     habitName={milestone.habitName}
 *     onClose={clearMilestone}
 *   />
 * }
 * ```
 */

import { useEffect, useRef, useState } from 'react';
import { getStrengthLevel } from '../../components/HabitStrengthIndicator';
import type {
  MilestoneAchievement,
  UseMilestoneDetectionReturn,
} from './types';
import { checkMilestoneCrossed } from './utils';

/**
 * Hook for detecting milestone achievements when habit strength levels up.
 * Compares previous and current strength to detect threshold crossings.
 *
 * @description
 * Milestone thresholds (strength levels):
 * - Budding: 0-19%
 * - Growing: 20-39%
 * - Developing: 40-59%
 * - Strong: 60-79%
 * - Unbreakable: 80-100%
 *
 * Features:
 * - Detects strength level crossings (e.g., 38% → 42% = milestone achieved)
 * - Prevents duplicate celebrations for same milestone
 * - Tracks shown milestones per habit via ref
 * - Provides clearMilestone() to dismiss celebration
 *
 * @param habitId - Unique identifier for the habit
 * @param habitName - Display name for the habit (shown in celebration)
 * @param currentStrength - Current strength percentage (0-100)
 * @returns Object with milestone state and control function
 * @returns returns.milestone - Current milestone achievement (null if none)
 * @returns returns.clearMilestone - Function to dismiss milestone celebration
 *
 * @example
 * ```tsx
 * function HabitCompletionFlow({ habit }) {
 *   const { currentStrength } = useHabitStrength(
 *     habit.completedDates,
 *     habit.createdAt
 *   );
 *
 *   const { milestone, clearMilestone } = useMilestoneDetection(
 *     habit._id,
 *     habit.name,
 *     currentStrength
 *   );
 *
 *   return (
 *     <>
 *       <HabitDetails habit={habit} strength={currentStrength} />
 *       {milestone && (
 *         <MilestoneCelebration
 *           visible
 *           level={milestone.level}
 *           strength={milestone.strength}
 *           habitName={milestone.habitName}
 *           onClose={clearMilestone}
 *         />
 *       )}
 *     </>
 *   );
 * }
 * ```
 */
export function useMilestoneDetection(
  habitId: string | undefined,
  habitName: string | undefined,
  currentStrength: number | undefined
): UseMilestoneDetectionReturn {
  const previousStrengthRef = useRef<number | undefined>(undefined);
  const shownMilestonesRef = useRef<Set<string>>(new Set());
  const [milestone, setMilestone] = useState<MilestoneAchievement | null>(null);

  useEffect(() => {
    if (
      habitId === undefined ||
      habitName === undefined ||
      currentStrength === undefined
    ) {
      return;
    }

    if (previousStrengthRef.current === undefined) {
      previousStrengthRef.current = currentStrength;
      return;
    }

    const previousStrength = previousStrengthRef.current;
    const milestoneCrossed = checkMilestoneCrossed(
      previousStrength,
      currentStrength
    );

    if (milestoneCrossed) {
      const newLevel = getStrengthLevel(currentStrength);
      const milestoneKey = `${habitId}-${newLevel}`;

      if (!shownMilestonesRef.current.has(milestoneKey)) {
        shownMilestonesRef.current.add(milestoneKey);
        setMilestone({
          habitId,
          habitName,
          level: newLevel,
          previousStrength,
          strength: currentStrength,
        });
      }
    }

    previousStrengthRef.current = currentStrength;
  }, [habitId, habitName, currentStrength]);

  const clearMilestone = () => setMilestone(null);

  return { clearMilestone, milestone };
}
