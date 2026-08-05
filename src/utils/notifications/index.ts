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

async function loadPermissionsModule() {
  if (process.env.JEST_WORKER_ID) {
    return require('./permissions') as typeof import('./permissions');
  }

  return import('./permissions');
}

async function loadHabitRemindersModule() {
  if (process.env.JEST_WORKER_ID) {
    return require('./habitReminders') as typeof import('./habitReminders');
  }

  return import('./habitReminders');
}

export async function ensureNotificationPermissions(): Promise<boolean> {
  const mod = await loadPermissionsModule();
  return mod.ensureNotificationPermissions();
}

export async function cancelHabitReminder(habitId: string): Promise<void> {
  const mod = await loadHabitRemindersModule();
  return mod.cancelHabitReminder(habitId);
}

export async function scheduleHabitReminder(
  ...args: Parameters<typeof import('./habitReminders').scheduleHabitReminder>
): ReturnType<typeof import('./habitReminders').scheduleHabitReminder> {
  const mod = await loadHabitRemindersModule();
  return mod.scheduleHabitReminder(...args);
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
