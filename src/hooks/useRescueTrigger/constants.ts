/**
 * Constants for useRescueTrigger hook
 */

import type { QuietHoursConfig, RescueTriggerConfig } from './types';

/** Default quiet hours: 10 PM - 7 AM (disabled by default) */
export const DEFAULT_QUIET_HOURS: QuietHoursConfig = {
  enabled: false,
  endTime: '07:00',
  startTime: '22:00',
};

export const DEFAULT_CONFIG: Required<RescueTriggerConfig> = {
  enableAppResumeTrigger: true,
  enableScheduledTrigger: true,
  hoursBeforeEnd: 3,
  minStreakForRescue: 1,
  quietHours: DEFAULT_QUIET_HOURS,
  respectSystemDND: true,
};

/** Interval for checking scheduled triggers (15 minutes) */
export const SCHEDULED_CHECK_INTERVAL_MS = 15 * 60 * 1000;

/** Interval for midnight reset check (1 minute) */
export const MIDNIGHT_CHECK_INTERVAL_MS = 60 * 1000;
