// Keep this module lightweight.
// Avoid importing expo-notifications eagerly at app startup.

export { ANDROID_CHANNEL_ID } from './constants';

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

export async function ensureNotificationPermissions(): Promise<boolean> {
  const mod = await import('./permissions');
  return mod.ensureNotificationPermissions();
}

export async function hasNotificationPermissions(): Promise<boolean> {
  const mod = await import('./permissions');
  return mod.hasNotificationPermissions();
}

export async function registerRemotePushTokenIfNeeded(): Promise<
  import('./remotePush').RemotePushRegistrationResult
> {
  const mod = await import('./remotePush');
  return mod.registerRemotePushTokenIfNeeded();
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

export async function rescheduleHabitReminderFromSettings(
  ...args: Parameters<
    typeof import('./habitReminderReschedule').rescheduleHabitReminderFromSettings
  >
): ReturnType<
  typeof import('./habitReminderReschedule').rescheduleHabitReminderFromSettings
> {
  const mod = await import('./habitReminderReschedule');
  return mod.rescheduleHabitReminderFromSettings(...args);
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

export type { ScheduleHabitReminderParams } from './types';
export type { ScheduleStreakAtRiskParams } from './streakAtRisk';
export type { ScheduleStreakFreezeParams } from './streakFreeze';
