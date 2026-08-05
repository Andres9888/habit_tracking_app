/**
 * Scheduled trigger effect for useRescueTrigger
 */

import { useEffect } from 'react';
import type { RescueEligibleHabit } from './types';
import { getHoursUntilMidnight } from './timeUtils';
import { SCHEDULED_CHECK_INTERVAL_MS } from './constants';

interface UseScheduledTriggerProps {
  enabled: boolean;
  hoursBeforeEnd: number;
  habitNeedingRescue: string | null;
  findHabitNeedingRescue: (
    checkScheduled: boolean
  ) => RescueEligibleHabit | null;
  triggerRescue: (habitId: string, reason: 'manual' | 'scheduled') => void;
  checkQuietHours: () => boolean;
  setHoursRemaining: (hours: number) => void;
}

export function useScheduledTrigger({
  enabled,
  hoursBeforeEnd,
  habitNeedingRescue,
  findHabitNeedingRescue,
  triggerRescue,
  checkQuietHours,
  setHoursRemaining,
}: UseScheduledTriggerProps) {
  useEffect(() => {
    if (!enabled) return;

    const checkScheduledTrigger = () => {
      const hours = getHoursUntilMidnight();
      setHoursRemaining(hours);

      const inQuiet = checkQuietHours();
      if (inQuiet) {
        if (__DEV__) console.warn('[useRescueTrigger] In quiet hours, skipping trigger');
        return;
      }

      if (hours <= hoursBeforeEnd && hours > 0) {
        const habit = findHabitNeedingRescue(true);
        if (habit && !habitNeedingRescue) {
          if (__DEV__) console.warn(
            `[useRescueTrigger] Scheduled trigger for habit: ${habit.name}`
          );
          triggerRescue(habit.id, 'scheduled');
        }
      }
    };

    checkScheduledTrigger();
    const interval = setInterval(
      checkScheduledTrigger,
      SCHEDULED_CHECK_INTERVAL_MS
    );

    return () => clearInterval(interval);
  }, [
    enabled,
    hoursBeforeEnd,
    findHabitNeedingRescue,
    habitNeedingRescue,
    triggerRescue,
    checkQuietHours,
    setHoursRemaining,
  ]);
}
