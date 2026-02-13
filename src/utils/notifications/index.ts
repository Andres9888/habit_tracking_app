// Initialize notification handler
import './handler';

// Re-export constants
export {
  ANDROID_AFFIRMATION_CHANNEL_ID,
  ANDROID_CHANNEL_ID,
  ANDROID_LETTER_CHANNEL_ID,
  NOTIFICATION_TYPE_AFFIRMATION_DELIVERY,
  NOTIFICATION_TYPE_LETTER_UNLOCK,
} from './constants';

// Re-export permissions
export { ensureNotificationPermissions } from './permissions';

// Re-export habit reminders
export { cancelHabitReminder, scheduleHabitReminder } from './habitReminders';

// Re-export time utilities
export {
  createDateFromTimeString,
  formatReminderTime,
  getDefaultReminderTime,
} from './timeUtils';

// Re-export relative time utilities (separate to avoid circular deps)
export {
  formatRelativeTime,
  getNextReminderRelativeTime,
} from './relativeTimeFormatter';

// Re-export letter unlock notifications
export {
  cancelLetterUnlockNotification,
  getScheduledLetterUnlockNotifications,
  scheduleLetterUnlockNotification,
} from './letters';

// Re-export affirmation delivery notifications
export {
  cancelAffirmationDelivery,
  cancelAllAffirmationDeliveriesForHabit,
  formatDaysOfWeek,
  getNextAffirmationDeliveryRelativeTime,
  getScheduledAffirmationDeliveries,
  scheduleAffirmationDelivery,
} from './affirmations';

// Re-export streak-at-risk notifications
export {
  cancelAllStreakAtRiskNotifications,
  cancelStreakAtRiskNotification,
  scheduleStreakAtRiskNotification,
} from './streakAtRisk';
export type { ScheduleStreakAtRiskParams } from './streakAtRisk';

// Re-export streak freeze notifications (premium)
export {
  cancelAllStreakFreezeNotifications,
  cancelStreakFreezeNotification,
  scheduleStreakFreezeNotification,
} from './streakFreeze';
export type { ScheduleStreakFreezeParams } from './streakFreeze';

// Re-export types
export type {
  ScheduleHabitReminderParams,
  ScheduleLetterUnlockParams,
  ScheduledLetterNotification,
} from './types';
export type {
  AffirmationFrequency,
  ScheduleAffirmationDeliveryParams,
  ScheduledAffirmationDelivery,
} from './affirmations';
