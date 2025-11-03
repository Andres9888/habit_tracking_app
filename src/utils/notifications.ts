import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

/**
 * Notification Configuration
 *
 * Note: The warning about expo-notifications in Expo Go is expected.
 * Remote (push) notifications require a development build as of SDK 53+.
 * Local/scheduled notifications (used by this app) work fine in Expo Go.
 *
 * To suppress the warning, use a development build instead of Expo Go:
 * https://docs.expo.dev/develop/development-builds/introduction/
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const ANDROID_CHANNEL_ID = 'habit-reminders';

async function configureAndroidChannel() {
  if (Platform.OS !== 'android') {
    return;
  }

  await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
    name: 'Habit Reminders',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'default',
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#3B82F6',
  });
}

export async function ensureNotificationPermissions(): Promise<boolean> {
  const currentPermissions = await Notifications.getPermissionsAsync();

  if (
    currentPermissions.granted ||
    currentPermissions.ios?.status === Notifications.AuthorizationStatus.GRANTED
  ) {
    await configureAndroidChannel();
    return true;
  }

  const requestedPermissions = await Notifications.requestPermissionsAsync();

  if (
    requestedPermissions.granted ||
    requestedPermissions.ios?.status === Notifications.AuthorizationStatus.GRANTED
  ) {
    await configureAndroidChannel();
    return true;
  }

  return false;
}

export async function cancelHabitReminder(habitId: string): Promise<void> {
  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();

  const toCancel = scheduledNotifications.filter(
    (notification) => notification.content?.data?.habitId === habitId
  );

  await Promise.all(
    toCancel.map((notification) =>
      Notifications.cancelScheduledNotificationAsync(notification.identifier)
    )
  );
}

export function createDateFromTimeString(time?: string, fallback?: Date): Date {
  const base = fallback ?? defaultReminderTime();

  if (!time) {
    return base;
  }

  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) {
    return base;
  }

  let hour = Number.parseInt(match[1], 10);
  const minute = Number.parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === 'PM' && hour < 12) {
    hour += 12;
  } else if (period === 'AM' && hour === 12) {
    hour = 0;
  }

  const result = new Date();
  result.setHours(hour, minute, 0, 0);
  return result;
}

export function formatReminderTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');

  return `${displayHours}:${displayMinutes} ${period}`;
}

function defaultReminderTime() {
  const date = new Date();
  date.setHours(14, 0, 0, 0);
  return date;
}

export function getDefaultReminderTime(): Date {
  return new Date(defaultReminderTime().getTime());
}

interface ScheduleHabitReminderParams {
  habitId: string;
  title: string;
  body: string;
  reminderTime: Date;
  skipPermissionCheck?: boolean;
}

export async function scheduleHabitReminder({
  habitId,
  title,
  body,
  reminderTime,
  skipPermissionCheck = false,
}: ScheduleHabitReminderParams): Promise<boolean> {
  if (!skipPermissionCheck) {
    const hasPermission = await ensureNotificationPermissions();

    if (!hasPermission) {
      return false;
    }
  } else {
    await configureAndroidChannel();
  }

  await cancelHabitReminder(habitId);

  const trigger = {
    hour: reminderTime.getHours(),
    minute: reminderTime.getMinutes(),
    repeats: true,
  };

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: 'default',
      data: { habitId },
      ...(Platform.OS === 'android' && { android: { channelId: ANDROID_CHANNEL_ID } }),
    },
    trigger,
  });

  return true;
}

