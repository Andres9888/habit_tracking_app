/**
 * App resume trigger effect for useRescueTrigger
 */

import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import type { RescueEligibleHabit } from './types';
import { getHoursUntilMidnight } from './timeUtils';

interface UseAppResumeTriggerProps {
  enabled: boolean;
  hoursBeforeEnd: number;
  habitNeedingRescue: string | null;
  findHabitNeedingRescue: (
    checkScheduled: boolean
  ) => RescueEligibleHabit | null;
  setHabitNeedingRescue: (habitId: string | null) => void;
  setTriggerReason: (
    reason: 'scheduled' | 'app_resume' | 'manual' | null
  ) => void;
  checkQuietHours: () => boolean;
  setHoursRemaining: (hours: number) => void;
}

export function useAppResumeTrigger({
  enabled,
  hoursBeforeEnd,
  habitNeedingRescue,
  findHabitNeedingRescue,
  setHabitNeedingRescue,
  setTriggerReason,
  checkQuietHours,
  setHoursRemaining,
}: UseAppResumeTriggerProps) {
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    if (!enabled) return;

    const handleAppStateChange = (nextState: AppStateStatus) => {
      const wasBackground = appStateRef.current.match(/inactive|background/);

      if (wasBackground && nextState === 'active') {
        const hours = getHoursUntilMidnight();
        setHoursRemaining(hours);

        const inQuiet = checkQuietHours();
        if (inQuiet) {
          if (__DEV__) console.warn(
            '[useRescueTrigger] App resume in quiet hours, skipping trigger'
          );
          appStateRef.current = nextState;
          return;
        }

        if (hours <= hoursBeforeEnd && hours > 0) {
          const habit = findHabitNeedingRescue(true);
          if (habit && !habitNeedingRescue) {
            if (__DEV__) console.warn(
              `[useRescueTrigger] App resume trigger for habit: ${habit.name}`
            );
            setHabitNeedingRescue(habit.id);
            setTriggerReason('app_resume');
          }
        }
      }

      appStateRef.current = nextState;
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );
    return () => subscription.remove();
  }, [
    enabled,
    hoursBeforeEnd,
    findHabitNeedingRescue,
    habitNeedingRescue,
    setHabitNeedingRescue,
    setTriggerReason,
    checkQuietHours,
    setHoursRemaining,
  ]);
}
