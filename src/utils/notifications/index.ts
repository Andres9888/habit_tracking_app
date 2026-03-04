// Keep this module lightweight.
// Avoid importing expo-notifications eagerly at app startup.

export {
  ANDROID_AFFIRMATION_CHANNEL_ID,
  ANDROID_CHANNEL_ID,
  ANDROID_LETTER_CHANNEL_ID,
  NOTIFICATION_TYPE_AFFIRMATION_DELIVERY,
  NOTIFICATION_TYPE_LETTER_UNLOCK,
} from './constants';

export {
  createDateFromTimeString,
  formatReminderTime,
  formatReminderTime24,
  getDefaultReminderTime,
} from './timeUtils';

export {
  formatRelativeTime,
  getNextReminderRelativeTime,
} from './relativeTimeFormatter';

export {
  formatDaysOfWeek,
  getNextWeeklyOccurrence,
} from './affirmations/weeklyUtils';

export { getNextAffirmationDeliveryRelativeTime } from './affirmations/relativeTime';

export async function ensureNotificationPermissions(): Promise<boolean> {
  const mod = await import('./permissions');
  return mod.ensureNotificationPermissions();
}

export async function cancelHabitReminder(habitId: string): Promise<void> {
  const mod = await import('./habitReminders');
  return mod.cancelHabitReminder(habitId);
}

export async function scheduleHabitReminder(
  ...args: Parameters<typeof import('./habitReminders').scheduleHabitReminder>
): ReturnType<typeof import('./habitReminders').scheduleHabitReminder> {
  const mod = await import('./habitReminders');
  return mod.scheduleHabitReminder(...args);
}

export async function cancelLetterUnlockNotification(
  ...args: Parameters<
    typeof import('./letters/cancel').cancelLetterUnlockNotification
  >
): ReturnType<
  typeof import('./letters/cancel').cancelLetterUnlockNotification
> {
  const mod = await import('./letters/cancel');
  return mod.cancelLetterUnlockNotification(...args);
}

export async function getScheduledLetterUnlockNotifications(
  ...args: Parameters<
    typeof import('./letters/getScheduled').getScheduledLetterUnlockNotifications
  >
): ReturnType<
  typeof import('./letters/getScheduled').getScheduledLetterUnlockNotifications
> {
  const mod = await import('./letters/getScheduled');
  return mod.getScheduledLetterUnlockNotifications(...args);
}

export async function scheduleLetterUnlockNotification(
  ...args: Parameters<
    typeof import('./letters/schedule').scheduleLetterUnlockNotification
  >
): ReturnType<
  typeof import('./letters/schedule').scheduleLetterUnlockNotification
> {
  const mod = await import('./letters/schedule');
  return mod.scheduleLetterUnlockNotification(...args);
}

export async function cancelAffirmationDelivery(
  ...args: Parameters<
    typeof import('./affirmations/cancel').cancelAffirmationDelivery
  >
): ReturnType<
  typeof import('./affirmations/cancel').cancelAffirmationDelivery
> {
  const mod = await import('./affirmations/cancel');
  return mod.cancelAffirmationDelivery(...args);
}

export async function cancelAllAffirmationDeliveriesForHabit(
  ...args: Parameters<
    typeof import('./affirmations/cancel').cancelAllAffirmationDeliveriesForHabit
  >
): ReturnType<
  typeof import('./affirmations/cancel').cancelAllAffirmationDeliveriesForHabit
> {
  const mod = await import('./affirmations/cancel');
  return mod.cancelAllAffirmationDeliveriesForHabit(...args);
}

export async function getScheduledAffirmationDeliveries(
  ...args: Parameters<
    typeof import('./affirmations/getScheduled').getScheduledAffirmationDeliveries
  >
): ReturnType<
  typeof import('./affirmations/getScheduled').getScheduledAffirmationDeliveries
> {
  const mod = await import('./affirmations/getScheduled');
  return mod.getScheduledAffirmationDeliveries(...args);
}

export async function scheduleAffirmationDelivery(
  ...args: Parameters<
    typeof import('./affirmations/schedule').scheduleAffirmationDelivery
  >
): ReturnType<
  typeof import('./affirmations/schedule').scheduleAffirmationDelivery
> {
  const mod = await import('./affirmations/schedule');
  return mod.scheduleAffirmationDelivery(...args);
}

export {
  cancelAllStreakAtRiskNotifications,
  cancelStreakAtRiskNotification,
  scheduleStreakAtRiskNotification,
} from './lazyStreakAtRisk';

export {
  cancelAllStreakFreezeNotifications,
  cancelStreakFreezeNotification,
  scheduleStreakFreezeNotification,
} from './lazyStreakFreeze';

export type {
  ScheduleHabitReminderParams,
  ScheduleLetterUnlockParams,
  ScheduledLetterNotification,
} from './types';
export type { ScheduleStreakAtRiskParams } from './streakAtRisk';
export type { ScheduleStreakFreezeParams } from './streakFreeze';
export type {
  AffirmationFrequency,
  ScheduleAffirmationDeliveryParams,
  ScheduledAffirmationDelivery,
} from './affirmations';
