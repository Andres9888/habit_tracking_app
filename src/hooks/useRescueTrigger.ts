/**
 * useRescueTrigger Hook
 * Determines when to show Rescue Mode for at-risk habits
 *
 * Part of T8.6-T8.7: Rescue Mode trigger logic
 *
 * Trigger Conditions:
 * 1. X hours before day ends with habit incomplete (configurable)
 * 2. User opens app after missing scheduled notification
 * 3. Manually triggered from habit card (handled elsewhere)
 *
 * Safety Checks:
 * - Don't trigger if habit already completed today
 * - Don't trigger for paused/archived habits
 * - Limit to 1 rescue per habit per day
 * - Respect Do Not Disturb (handled by notification system)
 *
 * Scientific Basis:
 * - Loss aversion is most powerful close to deadline
 * - Urgency drives action (Duolingo streak protection model)
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

/** Habit data needed for rescue trigger evaluation */
export interface RescueEligibleHabit {
  /** Habit ID */
  id: string;
  /** Habit name (for logging) */
  name: string;
  /** Whether habit is completed today */
  isCompletedToday: boolean;
  /** Whether habit is active (not paused/archived) */
  isActive: boolean;
  /** Scheduled notification time (HH:MM format or Date) */
  scheduledTime?: string | Date;
  /** Current streak (affects urgency) */
  currentStreak?: number;
  /** Whether rescue was already shown today */
  rescueShownToday?: boolean;
}

export interface RescueTriggerConfig {
  /** Hours before midnight to trigger rescue (default: 3) */
  hoursBeforeEnd?: number;
  /** Minimum streak to show rescue (default: 1, 0 = always) */
  minStreakForRescue?: number;
  /** Enable app resume trigger (default: true) */
  enableAppResumeTrigger?: boolean;
  /** Enable scheduled trigger (default: true) */
  enableScheduledTrigger?: boolean;
}

export interface RescueTriggerResult {
  /** Habit ID that needs rescue, or null if none */
  habitNeedingRescue: string | null;
  /** Hours remaining until day ends */
  hoursRemaining: number;
  /** Reason rescue was triggered */
  triggerReason: 'scheduled' | 'app_resume' | 'manual' | null;
  /** Clear the rescue trigger (after showing modal) */
  clearRescue: () => void;
  /** Manually trigger rescue for a habit */
  triggerRescue: (habitId: string, reason?: 'manual' | 'scheduled') => void;
  /** Mark rescue as shown for a habit today */
  markRescueShown: (habitId: string) => void;
  /** Check if a habit is eligible for rescue */
  isEligibleForRescue: (habit: RescueEligibleHabit) => boolean;
}

const DEFAULT_CONFIG: Required<RescueTriggerConfig> = {
  enableAppResumeTrigger: true,
  enableScheduledTrigger: true,
  hoursBeforeEnd: 3,
  minStreakForRescue: 1,
};

/**
 * Calculate hours remaining until end of day (midnight)
 */
function getHoursUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);

  const msRemaining = midnight.getTime() - now.getTime();
  return msRemaining / (1000 * 60 * 60);
}

/**
 * Check if current time is past the scheduled habit time
 */
function isPastScheduledTime(scheduledTime?: string | Date): boolean {
  if (!scheduledTime) return false;

  const now = new Date();
  let scheduled: Date;

  if (typeof scheduledTime === 'string') {
    // Parse HH:MM format
    const [hours, minutes] = scheduledTime.split(':').map(Number);
    scheduled = new Date(now);
    scheduled.setHours(hours, minutes, 0, 0);
  } else {
    scheduled = scheduledTime;
  }

  return now > scheduled;
}

/**
 * Hook to determine when to show Rescue Mode
 *
 * @param habits - Array of habits to evaluate
 * @param config - Configuration options
 * @returns Rescue trigger state and controls
 *
 * @example
 * ```tsx
 * const {
 *   habitNeedingRescue,
 *   hoursRemaining,
 *   clearRescue,
 * } = useRescueTrigger(habits, { hoursBeforeEnd: 2 });
 *
 * useEffect(() => {
 *   if (habitNeedingRescue) {
 *     openRescueMode(habitNeedingRescue);
 *   }
 * }, [habitNeedingRescue]);
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

  // Track which habits have had rescue shown today
  const rescueShownRef = useRef<Set<string>>(new Set());

  // Track app state for resume detection
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const wasBackgroundRef = useRef(false);

  /**
   * Check if a specific habit is eligible for rescue
   */
  const isEligibleForRescue = useCallback(
    (habit: RescueEligibleHabit): boolean => {
      // Already completed - no rescue needed
      if (habit.isCompletedToday) return false;

      // Inactive habit (paused/archived) - skip
      if (!habit.isActive) return false;

      // Already shown rescue today - don't spam
      if (habit.rescueShownToday || rescueShownRef.current.has(habit.id)) {
        return false;
      }

      // Check minimum streak requirement
      const streak = habit.currentStreak ?? 0;
      if (streak < mergedConfig.minStreakForRescue) {
        return false;
      }

      return true;
    },
    [mergedConfig.minStreakForRescue]
  );

  /**
   * Find the highest-priority habit needing rescue
   * Priority: Higher streak = more urgent
   */
  const findHabitNeedingRescue = useCallback(
    (checkScheduled: boolean): RescueEligibleHabit | null => {
      const eligibleHabits = habits.filter((habit) => {
        if (!isEligibleForRescue(habit)) return false;

        // For scheduled check, must be past scheduled time
        if (checkScheduled && !isPastScheduledTime(habit.scheduledTime)) {
          return false;
        }

        return true;
      });

      if (eligibleHabits.length === 0) return null;

      // Sort by streak (highest first) to prioritize most valuable streaks
      eligibleHabits.sort(
        (a, b) => (b.currentStreak ?? 0) - (a.currentStreak ?? 0)
      );

      return eligibleHabits[0];
    },
    [habits, isEligibleForRescue]
  );

  /**
   * Manually trigger rescue for a habit
   */
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

  /**
   * Clear the current rescue trigger
   */
  const clearRescue = useCallback(() => {
    setHabitNeedingRescue(null);
    setTriggerReason(null);
  }, []);

  /**
   * Mark rescue as shown for a habit
   */
  const markRescueShown = useCallback((habitId: string) => {
    rescueShownRef.current.add(habitId);
  }, []);

  // Check for scheduled trigger (X hours before end of day)
  useEffect(() => {
    if (!mergedConfig.enableScheduledTrigger) return;

    const checkScheduledTrigger = () => {
      const hours = getHoursUntilMidnight();
      setHoursRemaining(hours);

      // Only trigger if within the window
      if (hours <= mergedConfig.hoursBeforeEnd && hours > 0) {
        const habit = findHabitNeedingRescue(true);
        if (habit && !habitNeedingRescue) {
          console.log(
            `[useRescueTrigger] Scheduled trigger for habit: ${habit.name}`
          );
          triggerRescue(habit.id, 'scheduled');
        }
      }
    };

    // Check immediately
    checkScheduledTrigger();

    // Check every 15 minutes
    const interval = setInterval(checkScheduledTrigger, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, [
    mergedConfig.enableScheduledTrigger,
    mergedConfig.hoursBeforeEnd,
    findHabitNeedingRescue,
    habitNeedingRescue,
    triggerRescue,
  ]);

  // Check for app resume trigger
  useEffect(() => {
    if (!mergedConfig.enableAppResumeTrigger) return;

    const handleAppStateChange = (nextState: AppStateStatus) => {
      const wasBackground = appStateRef.current.match(/inactive|background/);

      if (wasBackground && nextState === 'active') {
        // App resumed from background
        wasBackgroundRef.current = true;

        // Update hours remaining
        const hours = getHoursUntilMidnight();
        setHoursRemaining(hours);

        // Only trigger within the window
        if (hours <= mergedConfig.hoursBeforeEnd && hours > 0) {
          const habit = findHabitNeedingRescue(true);
          if (habit && !habitNeedingRescue) {
            console.log(
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
    mergedConfig.enableAppResumeTrigger,
    mergedConfig.hoursBeforeEnd,
    findHabitNeedingRescue,
    habitNeedingRescue,
  ]);

  // Reset rescue shown tracking at midnight
  useEffect(() => {
    const checkMidnight = () => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        rescueShownRef.current.clear();
      }
    };

    const interval = setInterval(checkMidnight, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    clearRescue,
    habitNeedingRescue,
    hoursRemaining,
    isEligibleForRescue,
    markRescueShown,
    triggerReason,
    triggerRescue,
  };
}

export default useRescueTrigger;
