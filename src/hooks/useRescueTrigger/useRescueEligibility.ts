/**
 * Eligibility logic for useRescueTrigger
 */

import { useCallback, type MutableRefObject } from 'react';
import type { RescueEligibleHabit } from './types';
import { isPastScheduledTime } from './timeUtils';

export function useRescueEligibility(
  habits: RescueEligibleHabit[],
  minStreakForRescue: number,
  rescueShownRef: MutableRefObject<Set<string>>
) {
  const isEligibleForRescue = useCallback(
    (habit: RescueEligibleHabit): boolean => {
      if (habit.isCompletedToday) return false;
      if (!habit.isActive) return false;
      if (habit.rescueShownToday || rescueShownRef.current.has(habit.id))
        return false;
      const streak = habit.currentStreak ?? 0;
      return streak >= minStreakForRescue;
    },
    [minStreakForRescue, rescueShownRef]
  );

  const findHabitNeedingRescue = useCallback(
    (checkScheduled: boolean): RescueEligibleHabit | null => {
      const eligible = habits.filter((habit) => {
        if (!isEligibleForRescue(habit)) return false;
        if (checkScheduled && !isPastScheduledTime(habit.scheduledTime))
          return false;
        return true;
      });

      if (eligible.length === 0) return null;
      eligible.sort((a, b) => (b.currentStreak ?? 0) - (a.currentStreak ?? 0));
      return eligible[0];
    },
    [habits, isEligibleForRescue]
  );

  return { findHabitNeedingRescue, isEligibleForRescue };
}
