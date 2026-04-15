/**
 * useStreakMilestoneIntegration Hook
 * Integrates streak milestone celebrations into the HabitCard completion flow
 *
 * Watches for streak changes after habit completion and triggers
 * the global milestone celebration when a threshold is crossed.
 */

import { useEffect, useRef } from 'react';
import { useStreakMilestone } from '../../StreakMilestoneCelebration';

interface UseStreakMilestoneIntegrationOptions {
  /** Habit ID */
  habitId: string;

  /** Habit display name */
  habitName: string;

  /** Habit emoji icon */
  habitEmoji: string;

  /** Current streak count */
  currentStreak: number;

  /** Whether the habit was just completed (true) or uncompleted (false) */
  isCompleted: boolean;

  /** User-defined streak goal target in days */
  goalDuration?: number;
}

/**
 * Hook to integrate streak milestone celebrations with habit completion
 *
 * Tracks previous streak value and triggers celebration when
 * a milestone threshold is crossed after completion.
 */
export function useStreakMilestoneIntegration({
  habitId,
  habitName,
  habitEmoji,
  currentStreak,
  isCompleted,
  goalDuration,
}: UseStreakMilestoneIntegrationOptions): void {
  const { checkAndCelebrate } = useStreakMilestone();

  // Track previous streak to detect crossing
  const previousStreakRef = useRef<number>(currentStreak);
  const wasCompletedRef = useRef<boolean>(isCompleted);

  useEffect(() => {
    // Only check when transitioning from uncompleted to completed
    const justCompleted = isCompleted && !wasCompletedRef.current;

    if (justCompleted && currentStreak > previousStreakRef.current) {
      // Habit was just completed and streak increased - check for milestone
      checkAndCelebrate(
        habitId,
        habitName,
        habitEmoji,
        previousStreakRef.current,
        currentStreak,
        goalDuration
      );
    }

    // Update refs for next comparison
    previousStreakRef.current = currentStreak;
    wasCompletedRef.current = isCompleted;
  }, [
    currentStreak,
    isCompleted,
    habitId,
    habitName,
    habitEmoji,
    goalDuration,
    checkAndCelebrate,
  ]);
}

export default useStreakMilestoneIntegration;
