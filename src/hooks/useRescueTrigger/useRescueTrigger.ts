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

/**
 * Hook for triggering Rescue Mode when habits are at risk of breaking their streak.
 * Monitors habits throughout the day and prompts user before midnight.
 *
 * @description
 * Rescue Mode helps users maintain long streaks by:
 * - Detecting habits not completed today that have active streaks
 * - Triggering prompts at scheduled times (afternoon/evening)
 * - Re-checking when app resumes from background
 * - Respecting quiet hours (late night, early morning)
 * - Showing urgency as midnight approaches
 * - Preventing duplicate prompts for same habit in same day
 * - Resetting trigger state at midnight
 *
 * Eligibility criteria:
 * - Habit has a streak >= minStreakForRescue (default: 3 days)
 * - Habit not completed today
 * - Habit not yet shown rescue prompt today
 * - Outside quiet hours window
 *
 * Trigger mechanisms:
 * 1. Scheduled: Runs at configured times (default: 15:00, 19:00, 21:30)
 * 2. App Resume: Checks when app comes to foreground
 * 3. Manual: Explicit triggerRescue() call
 *
 * @param habits - Array of habits with streak info
 * @param config - Configuration options
 * @param config.minStreakForRescue - Minimum streak to trigger rescue (default: 3)
 * @param config.triggerTimes - Times to check for rescue (default: ['15:00', '19:00', '21:30'])
 * @param config.quietHours - Hours to suppress rescue (default: { start: 22, end: 8 })
 * @param config.checkIntervalMs - How often to check triggers (default: 60000)
 * @returns Object with rescue state and control functions
 *
 * @example
 * ```tsx
 * function HomeScreen({ habits }) {
 *   const {
 *     habitNeedingRescue,
 *     triggerReason,
 *     hoursRemaining,
 *     clearRescue,
 *     markRescueShown
 *   } = useRescueTrigger(habits, {
 *     minStreakForRescue: 5,
 *     triggerTimes: ['16:00', '20:00']
 *   });
 *
 *   if (habitNeedingRescue) {
 *     const habit = habits.find(h => h.id === habitNeedingRescue);
 *     return (
 *       <RescueModal
 *         habit={habit}
 *         hoursRemaining={hoursRemaining}
 *         onComplete={() => {
 *           markRescueShown(habitNeedingRescue);
 *           clearRescue();
 *         }}
 *         onDismiss={clearRescue}
 *       />
 *     );
 *   }
 *
 *   return <HabitList habits={habits} />;
 * }
 * ```
 */
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
