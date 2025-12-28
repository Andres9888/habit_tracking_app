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
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const ANDROID_CHANNEL_ID = 'habit-reminders';
const ANDROID_LETTER_CHANNEL_ID = 'letter-unlocks';

async function configureAndroidChannel() {
  if (Platform.OS !== 'android') {
    return;
  }

  await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
    importance: Notifications.AndroidImportance.HIGH,
    lightColor: '#3B82F6',
    name: 'Habit Reminders',
    sound: 'default',
    vibrationPattern: [0, 250, 250, 250],
  });
}

/**
 * Configure Android notification channel for letter unlocks
 * Uses violet color to match the Letters to Self UI theme
 */
async function configureLetterUnlockChannel() {
  if (Platform.OS !== 'android') {
    return;
  }

  await Notifications.setNotificationChannelAsync(ANDROID_LETTER_CHANNEL_ID, {
    importance: Notifications.AndroidImportance.HIGH,
    lightColor: '#8b5cf6', // Violet-500 to match Letters theme
    name: 'Letter Unlocks',
    sound: 'default',
    vibrationPattern: [0, 250, 250, 250],
  });
}

function isNotificationsPermissionGranted(permissions: unknown): boolean {
  if (!permissions || typeof permissions !== 'object') {
    return false;
  }

  const granted = (permissions as { granted?: unknown }).granted;
  if (granted === true) {
    return true;
  }

  const status = (permissions as { status?: unknown }).status;
  if (status === 'granted') {
    return true;
  }

  const ios = (permissions as { ios?: unknown }).ios;
  if (ios && typeof ios === 'object') {
    const iosStatus = (ios as { status?: unknown }).status;
    // iOS: 0=NOT_DETERMINED, 1=DENIED, 2=AUTHORIZED, 3=PROVISIONAL, 4=EPHEMERAL
    if (typeof iosStatus === 'number' && iosStatus >= 2) {
      return true;
    }
  }

  return false;
}

export async function ensureNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return false;
  }

  try {
    const currentPermissions = await Notifications.getPermissionsAsync();

    if (isNotificationsPermissionGranted(currentPermissions)) {
      await configureAndroidChannel();
      return true;
    }

    const requestedPermissions = await Notifications.requestPermissionsAsync();

    if (isNotificationsPermissionGranted(requestedPermissions)) {
      await configureAndroidChannel();
      return true;
    }

    return false;
  } catch (error) {
    console.error('ensureNotificationPermissions failed', error);
    return false;
  }
}

export async function cancelHabitReminder(habitId: string): Promise<void> {
  try {
    const scheduledNotifications =
      await Notifications.getAllScheduledNotificationsAsync();

    const toCancel = scheduledNotifications.filter(
      (notification) => notification.content?.data?.habitId === habitId
    );

    await Promise.all(
      toCancel.map((notification) =>
        Notifications.cancelScheduledNotificationAsync(notification.identifier)
      )
    );
  } catch (error) {
    console.warn('cancelHabitReminder failed', { error, habitId });
  }
}

export function createDateFromTimeString(time?: string, fallback?: Date): Date {
  const base = fallback ?? defaultReminderTime();

  if (!time) {
    return base;
  }

  const trimmed = time.trim();

  const amPmMatch = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (amPmMatch) {
    let hour = Number.parseInt(amPmMatch[1], 10);
    const minute = Number.parseInt(amPmMatch[2], 10);
    const period = amPmMatch[3].toUpperCase();

    if (Number.isNaN(hour) || Number.isNaN(minute)) {
      return base;
    }

    if (period === 'PM' && hour < 12) {
      hour += 12;
    } else if (period === 'AM' && hour === 12) {
      hour = 0;
    }

    const result = new Date();
    result.setHours(hour, minute, 0, 0);
    return result;
  }

  const twentyFourHourMatch = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (twentyFourHourMatch) {
    const hour = Number.parseInt(twentyFourHourMatch[1], 10);
    const minute = Number.parseInt(twentyFourHourMatch[2], 10);

    if (
      Number.isNaN(hour) ||
      Number.isNaN(minute) ||
      hour < 0 ||
      hour > 23 ||
      minute < 0 ||
      minute > 59
    ) {
      return base;
    }

    const result = new Date();
    result.setHours(hour, minute, 0, 0);
    return result;
  }

  return base;
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

/**
 * Get relative time string for the next reminder occurrence
 * Examples: "In 8 hours", "In 35 minutes", "Tomorrow at 7am"
 */
export function getNextReminderRelativeTime(
  reminderTime?: string
): string | null {
  if (!reminderTime) {
    return null;
  }

  const reminderDate = createDateFromTimeString(reminderTime);
  const now = new Date();

  // If the reminder time has passed today, it's for tomorrow
  if (reminderDate.getTime() <= now.getTime()) {
    reminderDate.setDate(reminderDate.getDate() + 1);
  }

  const diffMs = reminderDate.getTime() - now.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  // Format the time for "Tomorrow at X" display
  const hours = reminderDate.getHours();
  const minutes = reminderDate.getMinutes();
  const period = hours >= 12 ? 'pm' : 'am';
  const displayHours = hours % 12 || 12;
  const timeStr =
    minutes === 0
      ? `${displayHours}${period}`
      : `${displayHours}:${minutes.toString().padStart(2, '0')}${period}`;

  // Check if it's tomorrow (different day)
  const isTomorrow =
    reminderDate.getDate() !== now.getDate() ||
    reminderDate.getMonth() !== now.getMonth() ||
    reminderDate.getFullYear() !== now.getFullYear();

  if (isTomorrow) {
    return `Tomorrow at ${timeStr}`;
  }

  // Same day - show relative time
  if (diffMinutes < 60) {
    return `In ${diffMinutes} minute${diffMinutes === 1 ? '' : 's'}`;
  }

  if (diffHours < 24) {
    const remainingMinutes = diffMinutes % 60;
    if (remainingMinutes === 0) {
      return `In ${diffHours} hour${diffHours === 1 ? '' : 's'}`;
    }
    return `In ${diffHours}h ${remainingMinutes}m`;
  }

  return `Tomorrow at ${timeStr}`;
}

export function getDefaultReminderTime(): Date {
  return new Date(defaultReminderTime());
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
  try {
    if (skipPermissionCheck) {
      await configureAndroidChannel();
    } else {
      const hasPermission = await ensureNotificationPermissions();

      if (!hasPermission) {
        return false;
      }
    }

    await cancelHabitReminder(habitId);

    await Notifications.scheduleNotificationAsync({
      content: {
        body,
        data: { habitId },
        sound: 'default',
        title,
      },
      trigger: {
        ...(Platform.OS === 'android' ? { channelId: ANDROID_CHANNEL_ID } : {}),
        hour: reminderTime.getHours(),
        minute: reminderTime.getMinutes(),
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
      },
    });

    return true;
  } catch (error) {
    console.error('scheduleHabitReminder failed', { error, habitId });
    return false;
  }
}

// ============================================================================
// LETTER UNLOCK NOTIFICATIONS
// ============================================================================

/**
 * Notification type identifier for letter unlocks
 * Used to differentiate from habit reminders in the notification response handler
 */
export const NOTIFICATION_TYPE_LETTER_UNLOCK = 'letterUnlock';

export interface ScheduleLetterUnlockParams {
  /** The ID of the letter */
  letterId: string;
  /** The ID of the associated habit */
  habitId: string;
  /** Optional title for the letter (used in notification) */
  letterTitle?: string;
  /** Timestamp (ms) when the letter unlocks */
  unlockAt: number;
  /** Skip permission check if already verified */
  skipPermissionCheck?: boolean;
}

/**
 * Schedule a notification for when a letter unlocks
 *
 * Uses a DATE trigger for one-time notification at exact unlock time.
 * Notification data includes type='letterUnlock' to differentiate from habit reminders.
 *
 * @returns Notification identifier string on success, null on failure
 */
export async function scheduleLetterUnlockNotification({
  letterId,
  habitId,
  letterTitle = 'Letter to Self',
  unlockAt,
  skipPermissionCheck = false,
}: ScheduleLetterUnlockParams): Promise<string | null> {
  try {
    // Don't schedule if unlock time is in the past
    if (unlockAt <= Date.now()) {
      console.warn(
        'scheduleLetterUnlockNotification: unlock time is in the past',
        {
          letterId,
          unlockAt,
        }
      );
      return null;
    }

    if (skipPermissionCheck) {
      await configureLetterUnlockChannel();
    } else {
      const hasPermission = await ensureNotificationPermissions();

      if (!hasPermission) {
        return null;
      }

      await configureLetterUnlockChannel();
    }

    // Cancel any existing notification for this letter
    await cancelLetterUnlockNotification(letterId);

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        body: 'Your letter to yourself is ready to read!',
        data: {
          habitId,
          letterId,
          type: NOTIFICATION_TYPE_LETTER_UNLOCK,
        },
        sound: 'default',
        title: `📬 ${letterTitle}`,
      },
      trigger: {
        ...(Platform.OS === 'android'
          ? { channelId: ANDROID_LETTER_CHANNEL_ID }
          : {}),
        date: new Date(unlockAt),
        type: Notifications.SchedulableTriggerInputTypes.DATE,
      },
    });

    console.log('scheduleLetterUnlockNotification success', {
      letterId,
      notificationId,
      unlockAt: new Date(unlockAt).toISOString(),
    });

    return notificationId;
  } catch (error) {
    console.error('scheduleLetterUnlockNotification failed', {
      error,
      letterId,
    });
    return null;
  }
}

/**
 * Cancel a scheduled letter unlock notification
 *
 * @param letterId The ID of the letter whose notification to cancel
 */
export async function cancelLetterUnlockNotification(
  letterId: string
): Promise<void> {
  try {
    const scheduledNotifications =
      await Notifications.getAllScheduledNotificationsAsync();

    const toCancel = scheduledNotifications.filter((notification) => {
      const data = notification.content?.data;
      return (
        data?.type === NOTIFICATION_TYPE_LETTER_UNLOCK &&
        data?.letterId === letterId
      );
    });

    await Promise.all(
      toCancel.map((notification) =>
        Notifications.cancelScheduledNotificationAsync(notification.identifier)
      )
    );

    if (toCancel.length > 0) {
      console.log('cancelLetterUnlockNotification: cancelled', {
        count: toCancel.length,
        letterId,
      });
    }
  } catch (error) {
    console.warn('cancelLetterUnlockNotification failed', { error, letterId });
  }
}

/**
 * Get all scheduled letter unlock notifications
 * Useful for debugging or displaying scheduled notifications to the user
 */
export async function getScheduledLetterUnlockNotifications(): Promise<
  Array<{
    notificationId: string;
    letterId: string;
    habitId: string;
    scheduledTime: Date | null;
  }>
> {
  try {
    const scheduledNotifications =
      await Notifications.getAllScheduledNotificationsAsync();

    return scheduledNotifications
      .filter(
        (notification) =>
          notification.content?.data?.type === NOTIFICATION_TYPE_LETTER_UNLOCK
      )
      .map((notification) => {
        const data = notification.content.data as {
          letterId?: string;
          habitId?: string;
        };

        // Extract scheduled time from trigger
        let scheduledTime: Date | null = null;
        const trigger = notification.trigger as { date?: Date } | null;
        if (trigger?.date) {
          scheduledTime = new Date(trigger.date);
        }

        return {
          habitId: data.habitId ?? '',
          letterId: data.letterId ?? '',
          notificationId: notification.identifier,
          scheduledTime,
        };
      });
  } catch (error) {
    console.error('getScheduledLetterUnlockNotifications failed', error);
    return [];
  }
}
