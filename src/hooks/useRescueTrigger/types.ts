/**
 * Types for useRescueTrigger hook
 */

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

/** Quiet hours configuration for Do Not Disturb respect */
export interface QuietHoursConfig {
  /** Whether quiet hours are enabled */
  enabled: boolean;
  /** Start time in HH:MM format (e.g., "22:00") */
  startTime: string;
  /** End time in HH:MM format (e.g., "07:00") */
  endTime: string;
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
  /** Quiet hours / Do Not Disturb configuration */
  quietHours?: QuietHoursConfig;
  /** Whether to respect system Do Not Disturb (checks notification permissions) */
  respectSystemDND?: boolean;
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
  /** Whether rescue is currently blocked by quiet hours / DND */
  isInQuietHours: boolean;
}
