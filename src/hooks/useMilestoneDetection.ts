/**
 * useMilestoneDetection Hook
 * Detects when a habit crosses a milestone threshold (20%, 40%, 60%, 80%)
 *
 * Purpose: Trigger MilestoneCelebration modal when user achieves new strength level
 * Logic: Compares previous and current strength to detect level-up crossing
 * Integration: Used in habit completion flow and strength calculation updates
 */

import { useEffect, useRef, useState } from 'react';
import { type StrengthLevel, getStrengthLevel } from '../components/HabitStrengthIndicator/HabitStrengthIndicator';

export interface MilestoneAchievement {
  /** The new level achieved */
  level: StrengthLevel;

  /** Current strength percentage */
  strength: number;

  /** Previous strength percentage */
  previousStrength: number;

  /** Habit ID */
  habitId: string;

  /** Habit name for display */
  habitName: string;
}

/**
 * Milestone thresholds (based on UX spec Section 8.2)
 * Trigger celebration when crossing these boundaries
 */
const MILESTONE_THRESHOLDS = [20, 40, 60, 80] as const;

/**
 * Check if a milestone was crossed between two strength values
 */
function checkMilestoneCrossed(
  previousStrength: number,
  currentStrength: number
): boolean {
  // Only trigger on upward movement
  if (currentStrength <= previousStrength) {
    return false;
  }

  // Check if any threshold was crossed
  return MILESTONE_THRESHOLDS.some(
    (threshold) => previousStrength < threshold && currentStrength >= threshold
  );
}

/**
 * Hook to detect milestone achievements
 *
 * Usage:
 * ```tsx
 * const { milestone, clearMilestone } = useMilestoneDetection(habitId, habitName, strength);
 *
 * // Show celebration modal when milestone is detected
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
export function useMilestoneDetection(
  habitId: string | undefined,
  habitName: string | undefined,
  currentStrength: number | undefined
): {
  milestone: MilestoneAchievement | null;
  clearMilestone: () => void;
} {
  // Track previous strength value
  const previousStrengthRef = useRef<number | undefined>(undefined);

  // Track milestones that have been shown (prevent duplicates)
  const shownMilestonesRef = useRef<Set<string>>(new Set());

  // State for current milestone achievement
  const [milestone, setMilestone] = useState<MilestoneAchievement | null>(null);

  useEffect(() => {
    // Skip if missing required data
    if (
      habitId === undefined ||
      habitName === undefined ||
      currentStrength === undefined
    ) {
      return;
    }

    // Initialize previous strength on first run
    if (previousStrengthRef.current === undefined) {
      previousStrengthRef.current = currentStrength;
      return;
    }

    // Check if milestone was crossed
    const previousStrength = previousStrengthRef.current;
    const milestoneCrossed = checkMilestoneCrossed(
      previousStrength,
      currentStrength
    );

    if (milestoneCrossed) {
      // Get new strength level
      const newLevel = getStrengthLevel(currentStrength);

      // Create unique key for this milestone (habit + level)
      const milestoneKey = `${habitId}-${newLevel}`;

      // Only show if not already shown (prevent duplicates)
      if (!shownMilestonesRef.current.has(milestoneKey)) {
        shownMilestonesRef.current.add(milestoneKey);

        // Set milestone for display
        setMilestone({
          level: newLevel,
          strength: currentStrength,
          previousStrength,
          habitId,
          habitName,
        });
      }
    }

    // Update previous strength
    previousStrengthRef.current = currentStrength;
  }, [habitId, habitName, currentStrength]);

  // Clear milestone (called when modal is dismissed)
  const clearMilestone = () => {
    setMilestone(null);
  };

  return { milestone, clearMilestone };
}

/**
 * Hook to track multiple habits' milestones
 *
 * Usage for tracking all habits in a list:
 * ```tsx
 * const { milestones, clearMilestone } = useMultiMilestoneDetection(habits);
 *
 * // Show first milestone in queue
 * const currentMilestone = milestones[0];
 * ```
 */
export function useMultiMilestoneDetection(
  habits: Array<{ id: string; name: string; strength: number }>
): {
  milestones: MilestoneAchievement[];
  clearMilestone: (habitId: string) => void;
} {
  const [milestones, setMilestones] = useState<MilestoneAchievement[]>([]);

  // Track previous strengths for all habits
  const previousStrengthsRef = useRef<Map<string, number>>(new Map());
  const shownMilestonesRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const newMilestones: MilestoneAchievement[] = [];

    habits.forEach((habit) => {
      const previousStrength = previousStrengthsRef.current.get(habit.id);

      // Initialize if first time seeing this habit
      if (previousStrength === undefined) {
        previousStrengthsRef.current.set(habit.id, habit.strength);
        return;
      }

      // Check for milestone
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
            level: newLevel,
            strength: habit.strength,
            previousStrength,
            habitId: habit.id,
            habitName: habit.name,
          });
        }
      }

      // Update previous strength
      previousStrengthsRef.current.set(habit.id, habit.strength);
    });

    // Add new milestones to queue
    if (newMilestones.length > 0) {
      setMilestones((prev) => [...prev, ...newMilestones]);
    }
  }, [habits]);

  // Clear specific milestone from queue
  const clearMilestone = (habitId: string) => {
    setMilestones((prev) => prev.filter((m) => m.habitId !== habitId));
  };

  return { milestones, clearMilestone };
}

export default useMilestoneDetection;
