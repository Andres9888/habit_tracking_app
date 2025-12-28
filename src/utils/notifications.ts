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
const ANDROID_AFFIRMATION_CHANNEL_ID = 'affirmation-delivery';

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

/**
 * Configure Android notification channel for affirmation delivery
 * Uses amber color to match the Affirmations UI theme
 */
async function configureAffirmationChannel() {
  if (Platform.OS !== 'android') {
    return;
  }

  await Notifications.setNotificationChannelAsync(
    ANDROID_AFFIRMATION_CHANNEL_ID,
    {
      importance: Notifications.AndroidImportance.DEFAULT,
      lightColor: '#f59e0b', // Amber-500 to match Affirmations theme
      name: 'Daily Affirmations',
      sound: 'default',
      vibrationPattern: [0, 200, 100, 200],
    }
  );
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

    // eslint-disable-next-line no-console
    console.info('scheduleLetterUnlockNotification success', {
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
      // eslint-disable-next-line no-console
      console.info('cancelLetterUnlockNotification: cancelled', {
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

// ============================================================================
// AFFIRMATION SCHEDULED DELIVERY NOTIFICATIONS
// ============================================================================

/**
 * Notification type identifier for affirmation delivery
 * Used to differentiate from habit reminders and letter unlocks
 */
export const NOTIFICATION_TYPE_AFFIRMATION_DELIVERY = 'affirmationDelivery';

/**
 * Affirmation frequency types matching the schema
 */
export type AffirmationFrequency = 'daily' | 'weekly';

export interface ScheduleAffirmationDeliveryParams {
  /** The ID of the affirmation */
  affirmationId: string;
  /** The ID of the associated habit */
  habitId: string;
  /** The affirmation text to display */
  affirmationText: string;
  /** Time of day in "HH:MM" 24-hour format */
  scheduledTime: string;
  /** Delivery frequency */
  frequency: AffirmationFrequency;
  /** Days of week for weekly frequency (0=Sunday, 6=Saturday) */
  daysOfWeek?: number[];
  /** Skip permission check if already verified */
  skipPermissionCheck?: boolean;
}

/**
 * Parse HH:MM time string to hours and minutes
 */
function parseTimeString(time: string): { hours: number; minutes: number } {
  const [hours, minutes] = time.split(':').map(Number);
  return { hours, minutes };
}

/**
 * Get the next occurrence of a weekly schedule
 * Returns the Date of the next scheduled day
 */
function getNextWeeklyOccurrence(
  hours: number,
  minutes: number,
  daysOfWeek: number[]
): Date {
  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  const targetTime = hours * 60 + minutes;

  // Sort days for consistent ordering
  const sortedDays = [...daysOfWeek].sort((a, b) => a - b);

  // Find the next scheduled day
  for (const day of sortedDays) {
    if (day > currentDay || (day === currentDay && targetTime > currentTime)) {
      // This day is in the future
      const daysUntil = day - currentDay;
      const nextDate = new Date(now);
      nextDate.setDate(now.getDate() + daysUntil);
      nextDate.setHours(hours, minutes, 0, 0);
      return nextDate;
    }
  }

  // All scheduled days have passed this week; schedule for next week
  const nextDay = sortedDays[0];
  const daysUntil = 7 - currentDay + nextDay;
  const nextDate = new Date(now);
  nextDate.setDate(now.getDate() + daysUntil);
  nextDate.setHours(hours, minutes, 0, 0);
  return nextDate;
}

/**
 * Format days of week for display
 * Returns human-readable string like "Mon, Wed, Fri" or "Every day"
 */
export function formatDaysOfWeek(daysOfWeek: number[]): string {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (daysOfWeek.length === 7) {
    return 'Every day';
  }

  const sortedDays = [...daysOfWeek].sort((a, b) => a - b);
  return sortedDays.map((day) => dayNames[day]).join(', ');
}

/**
 * Schedule a daily affirmation delivery notification
 *
 * Uses DAILY trigger for recurring notifications at the specified time.
 * For weekly schedules, uses DATE trigger for the next occurrence and
 * the client must reschedule after each delivery.
 *
 * @returns Notification identifier string on success, null on failure
 */
export async function scheduleAffirmationDelivery({
  affirmationId,
  habitId,
  affirmationText,
  scheduledTime,
  frequency,
  daysOfWeek,
  skipPermissionCheck = false,
}: ScheduleAffirmationDeliveryParams): Promise<string | null> {
  try {
    // Validate time format
    const timeMatch = scheduledTime.match(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/);
    if (!timeMatch) {
      console.warn(
        'scheduleAffirmationDelivery: invalid time format',
        scheduledTime
      );
      return null;
    }

    if (skipPermissionCheck) {
      await configureAffirmationChannel();
    } else {
      const hasPermission = await ensureNotificationPermissions();
      if (!hasPermission) {
        return null;
      }
      await configureAffirmationChannel();
    }

    // Cancel any existing notification for this affirmation
    await cancelAffirmationDelivery(affirmationId);

    const { hours, minutes } = parseTimeString(scheduledTime);

    // Truncate affirmation text for notification
    const truncatedText =
      affirmationText.length > 100
        ? affirmationText.slice(0, 97) + '...'
        : affirmationText;

    let notificationId: string;

    if (frequency === 'daily') {
      // Use DAILY trigger for every-day notifications
      notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          body: `"${truncatedText}"`,
          data: {
            affirmationId,
            habitId,
            type: NOTIFICATION_TYPE_AFFIRMATION_DELIVERY,
          },
          sound: 'default',
          title: '✨ Daily Affirmation',
        },
        trigger: {
          ...(Platform.OS === 'android'
            ? { channelId: ANDROID_AFFIRMATION_CHANNEL_ID }
            : {}),
          hour: hours,
          minute: minutes,
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
        },
      });
    } else {
      // Weekly frequency: use DATE trigger for next occurrence
      // Client must reschedule after delivery
      if (!daysOfWeek || daysOfWeek.length === 0) {
        console.warn(
          'scheduleAffirmationDelivery: weekly frequency requires daysOfWeek'
        );
        return null;
      }

      const nextDate = getNextWeeklyOccurrence(hours, minutes, daysOfWeek);

      notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          body: `"${truncatedText}"`,
          data: {
            affirmationId,
            daysOfWeek,
            frequency: 'weekly',
            habitId,
            type: NOTIFICATION_TYPE_AFFIRMATION_DELIVERY,
          },
          sound: 'default',
          title: '✨ Weekly Affirmation',
        },
        trigger: {
          ...(Platform.OS === 'android'
            ? { channelId: ANDROID_AFFIRMATION_CHANNEL_ID }
            : {}),
          date: nextDate,
          type: Notifications.SchedulableTriggerInputTypes.DATE,
        },
      });
    }

    // eslint-disable-next-line no-console
    console.info('scheduleAffirmationDelivery success', {
      affirmationId,
      frequency,
      notificationId,
      scheduledTime,
    });

    return notificationId;
  } catch (error) {
    console.error('scheduleAffirmationDelivery failed', {
      affirmationId,
      error,
    });
    return null;
  }
}

/**
 * Cancel a scheduled affirmation delivery notification
 *
 * @param affirmationId The ID of the affirmation whose notification to cancel
 */
export async function cancelAffirmationDelivery(
  affirmationId: string
): Promise<void> {
  try {
    const scheduledNotifications =
      await Notifications.getAllScheduledNotificationsAsync();

    const toCancel = scheduledNotifications.filter((notification) => {
      const data = notification.content?.data;
      return (
        data?.type === NOTIFICATION_TYPE_AFFIRMATION_DELIVERY &&
        data?.affirmationId === affirmationId
      );
    });

    await Promise.all(
      toCancel.map((notification) =>
        Notifications.cancelScheduledNotificationAsync(notification.identifier)
      )
    );

    if (toCancel.length > 0) {
      // eslint-disable-next-line no-console
      console.info('cancelAffirmationDelivery: cancelled', {
        affirmationId,
        count: toCancel.length,
      });
    }
  } catch (error) {
    console.warn('cancelAffirmationDelivery failed', { affirmationId, error });
  }
}

/**
 * Cancel all scheduled affirmation notifications for a specific habit
 *
 * Useful when a habit is deleted or archived.
 */
export async function cancelAllAffirmationDeliveriesForHabit(
  habitId: string
): Promise<void> {
  try {
    const scheduledNotifications =
      await Notifications.getAllScheduledNotificationsAsync();

    const toCancel = scheduledNotifications.filter((notification) => {
      const data = notification.content?.data;
      return (
        data?.type === NOTIFICATION_TYPE_AFFIRMATION_DELIVERY &&
        data?.habitId === habitId
      );
    });

    await Promise.all(
      toCancel.map((notification) =>
        Notifications.cancelScheduledNotificationAsync(notification.identifier)
      )
    );

    if (toCancel.length > 0) {
      // eslint-disable-next-line no-console
      console.info('cancelAllAffirmationDeliveriesForHabit: cancelled', {
        count: toCancel.length,
        habitId,
      });
    }
  } catch (error) {
    console.warn('cancelAllAffirmationDeliveriesForHabit failed', {
      error,
      habitId,
    });
  }
}

/**
 * Get all scheduled affirmation delivery notifications
 * Useful for debugging or displaying scheduled notifications to the user
 */
export async function getScheduledAffirmationDeliveries(): Promise<
  Array<{
    notificationId: string;
    affirmationId: string;
    habitId: string;
    frequency: AffirmationFrequency;
    scheduledTime: Date | null;
    daysOfWeek?: number[];
  }>
> {
  try {
    const scheduledNotifications =
      await Notifications.getAllScheduledNotificationsAsync();

    return scheduledNotifications
      .filter(
        (notification) =>
          notification.content?.data?.type ===
          NOTIFICATION_TYPE_AFFIRMATION_DELIVERY
      )
      .map((notification) => {
        const data = notification.content.data as {
          affirmationId?: string;
          habitId?: string;
          frequency?: AffirmationFrequency;
          daysOfWeek?: number[];
        };

        // Extract scheduled time from trigger
        let scheduledTime: Date | null = null;
        const trigger = notification.trigger as {
          date?: Date;
          hour?: number;
          minute?: number;
        } | null;

        if (trigger?.date) {
          scheduledTime = new Date(trigger.date);
        } else if (
          trigger?.hour !== undefined &&
          trigger?.minute !== undefined
        ) {
          // For DAILY triggers, construct a Date for today at that time
          const now = new Date();
          scheduledTime = new Date(now);
          scheduledTime.setHours(trigger.hour, trigger.minute, 0, 0);
          // If time has passed today, it's for tomorrow
          if (scheduledTime.getTime() <= now.getTime()) {
            scheduledTime.setDate(scheduledTime.getDate() + 1);
          }
        }

        return {
          affirmationId: data.affirmationId ?? '',
          daysOfWeek: data.daysOfWeek,
          frequency: data.frequency ?? 'daily',
          habitId: data.habitId ?? '',
          notificationId: notification.identifier,
          scheduledTime,
        };
      });
  } catch (error) {
    console.error('getScheduledAffirmationDeliveries failed', error);
    return [];
  }
}

/**
 * Get relative time string for the next affirmation delivery
 * Examples: "In 8 hours", "Tomorrow at 7am", "Wed at 9am"
 */
export function getNextAffirmationDeliveryRelativeTime(
  scheduledTime: string,
  frequency: AffirmationFrequency,
  daysOfWeek?: number[]
): string | null {
  if (!scheduledTime) {
    return null;
  }

  const { hours, minutes } = parseTimeString(scheduledTime);
  const now = new Date();

  let nextDelivery: Date;

  if (frequency === 'daily') {
    // Daily: next occurrence is today (if not passed) or tomorrow
    nextDelivery = new Date(now);
    nextDelivery.setHours(hours, minutes, 0, 0);

    if (nextDelivery.getTime() <= now.getTime()) {
      nextDelivery.setDate(nextDelivery.getDate() + 1);
    }
  } else {
    // Weekly: find next scheduled day
    if (!daysOfWeek || daysOfWeek.length === 0) {
      return null;
    }
    nextDelivery = getNextWeeklyOccurrence(hours, minutes, daysOfWeek);
  }

  const diffMs = nextDelivery.getTime() - now.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  // Format time for display
  const displayHours = nextDelivery.getHours() % 12 || 12;
  const period = nextDelivery.getHours() >= 12 ? 'pm' : 'am';
  const displayMinutes = nextDelivery.getMinutes();
  const timeStr =
    displayMinutes === 0
      ? `${displayHours}${period}`
      : `${displayHours}:${displayMinutes.toString().padStart(2, '0')}${period}`;

  // Day names for weekly display
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Check if it's today
  const isToday =
    nextDelivery.getDate() === now.getDate() &&
    nextDelivery.getMonth() === now.getMonth() &&
    nextDelivery.getFullYear() === now.getFullYear();

  // Check if it's tomorrow
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const isTomorrow =
    nextDelivery.getDate() === tomorrow.getDate() &&
    nextDelivery.getMonth() === tomorrow.getMonth() &&
    nextDelivery.getFullYear() === tomorrow.getFullYear();

  if (isToday) {
    // Same day - show relative time
    if (diffMinutes < 60) {
      return `In ${diffMinutes} minute${diffMinutes === 1 ? '' : 's'}`;
    }
    const remainingMinutes = diffMinutes % 60;
    if (remainingMinutes === 0) {
      return `In ${diffHours} hour${diffHours === 1 ? '' : 's'}`;
    }
    return `In ${diffHours}h ${remainingMinutes}m`;
  }

  if (isTomorrow) {
    return `Tomorrow at ${timeStr}`;
  }

  // For weekly, show day name
  const dayName = dayNames[nextDelivery.getDay()];
  return `${dayName} at ${timeStr}`;
}
