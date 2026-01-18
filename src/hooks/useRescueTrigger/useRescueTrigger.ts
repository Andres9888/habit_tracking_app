/**
 * useRescueTrigger Hook - Determines when to show Rescue Mode for at-risk habits
 * Part of T8.6-T8.7: Rescue Mode trigger logic
 */

import { useCallback, useRef, useState } from 'react';
import type {
  RescueEligibleHabit,
  RescueTriggerConfig,
  RescueTriggerResult,
} from './types';
import { DEFAULT_CONFIG } from './constants';
import { getHoursUntilMidnight, isInQuietHoursWindow } from './timeUtils';
import { useRescueEligibility } from './useRescueEligibility';
import { useScheduledTrigger } from './useScheduledTrigger';
import { useAppResumeTrigger } from './useAppResumeTrigger';
import { useMidnightReset } from './useMidnightReset';

export function useRescueTrigger(
  habits: RescueEligibleHabit[],
  config: RescueTriggerConfig = {}
): RescueTriggerResult {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };

  const [habitNeedingRescue, setHabitNeedingRescue] = useState<string | null>(
    null
  );
  const [triggerReason, setTriggerReason] = useState<
    'scheduled' | 'app_resume' | 'manual' | null
  >(null);
  const [hoursRemaining, setHoursRemaining] = useState(getHoursUntilMidnight);
  const [isInQuietHours, setIsInQuietHours] = useState(() =>
    isInQuietHoursWindow(mergedConfig.quietHours)
  );

  const rescueShownRef = useRef<Set<string>>(new Set());

  const { isEligibleForRescue, findHabitNeedingRescue } = useRescueEligibility(
    habits,
    mergedConfig.minStreakForRescue,
    rescueShownRef
  );

  const checkQuietHours = useCallback((): boolean => {
    const inQuiet = isInQuietHoursWindow(mergedConfig.quietHours);
    setIsInQuietHours(inQuiet);
    return inQuiet;
  }, [mergedConfig.quietHours]);

  const triggerRescue = useCallback(
    (habitId: string, reason: 'manual' | 'scheduled' = 'manual') => {
      const habit = habits.find((h) => h.id === habitId);
      if (habit && isEligibleForRescue(habit)) {
        setHabitNeedingRescue(habitId);
        setTriggerReason(reason);
        setHoursRemaining(getHoursUntilMidnight());
      }
    },
    [habits, isEligibleForRescue]
  );

  const clearRescue = useCallback(() => {
    setHabitNeedingRescue(null);
    setTriggerReason(null);
  }, []);
  const markRescueShown = useCallback((habitId: string) => {
    rescueShownRef.current.add(habitId);
  }, []);

  useScheduledTrigger({
    checkQuietHours,
    enabled: mergedConfig.enableScheduledTrigger,
    findHabitNeedingRescue,
    habitNeedingRescue,
    hoursBeforeEnd: mergedConfig.hoursBeforeEnd,
    setHoursRemaining,
    triggerRescue,
  });

  useAppResumeTrigger({
    checkQuietHours,
    enabled: mergedConfig.enableAppResumeTrigger,
    findHabitNeedingRescue,
    habitNeedingRescue,
    hoursBeforeEnd: mergedConfig.hoursBeforeEnd,
    setHabitNeedingRescue,
    setHoursRemaining,
    setTriggerReason,
  });

  useMidnightReset(rescueShownRef);

  return {
    clearRescue,
    habitNeedingRescue,
    hoursRemaining,
    isEligibleForRescue,
    isInQuietHours,
    markRescueShown,
    triggerReason,
    triggerRescue,
  };
}

export default useRescueTrigger;
