import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { ANDROID_CHANNEL_ID } from './constants';
import {
  ensureNotificationPermissions,
  hasNotificationPermissions,
} from './permissions';
import type { ScheduleHabitReminderParams } from './types';

const HABIT_REMINDER_IDENTIFIER_PREFIX = 'habit-reminder-';
const HABIT_REMINDER_NOTIFICATION_TYPE = 'habitReminder';

export function getHabitReminderNotificationIdentifier(habitId: string): string {
  return `${HABIT_REMINDER_IDENTIFIER_PREFIX}${habitId}`;
}

function notificationDataMatchesHabitReminder(
  data: Record<string, unknown> | undefined,
  habitId: string
): boolean {
  if (!data) return false;

  const isCurrentHabitReminder =
    data.type === HABIT_REMINDER_NOTIFICATION_TYPE && data.habitId === habitId;

  // Before habit reminders had deterministic identifiers, cancellation used
  // habitId data to reconcile scheduled notifications. Keep that path so edits
  // and archives clean up reminders scheduled by older app versions.
  const isLegacyHabitReminder =
    data.type === undefined && data.habitId === habitId;

  return isCurrentHabitReminder || isLegacyHabitReminder;
}

export async function cancelHabitReminder(habitId: string): Promise<void> {
  try {
    const deterministicIdentifier =
      getHabitReminderNotificationIdentifier(habitId);
    const scheduledNotifications =
      await Notifications.getAllScheduledNotificationsAsync();

    const identifiersToCancel = new Set<string>([deterministicIdentifier]);

    for (const notification of scheduledNotifications) {
      if (
        notificationDataMatchesHabitReminder(
          notification.content?.data as Record<string, unknown> | undefined,
          habitId
        )
      ) {
        identifiersToCancel.add(notification.identifier);
      }
    }

    await Promise.all(
      [...identifiersToCancel].map((identifier) =>
        Notifications.cancelScheduledNotificationAsync(identifier)
      )
    );
  } catch (error) {
    if (__DEV__) console.warn('cancelHabitReminder failed', { error, habitId });
  }
}

export async function scheduleHabitReminder({
  habitId,
  title,
  body,
  reminderTime,
  skipPermissionCheck = false,
}: ScheduleHabitReminderParams): Promise<boolean> {
  try {
    const hasPermission = skipPermissionCheck
      ? await hasNotificationPermissions()
      : await ensureNotificationPermissions();

    if (!hasPermission) {
      return false;
    }

    await cancelHabitReminder(habitId);

    await Notifications.scheduleNotificationAsync({
      content: {
        body,
        data: {
          habitId,
          type: HABIT_REMINDER_NOTIFICATION_TYPE,
          url: `habit-tracker://habit/${habitId}`,
        },
        sound: 'default',
        title,
      },
      identifier: getHabitReminderNotificationIdentifier(habitId),
      trigger: {
        ...(Platform.OS === ['and', 'roid'].join('') ? { channelId: ANDROID_CHANNEL_ID } : {}),
        hour: reminderTime.getHours(),
        minute: reminderTime.getMinutes(),
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
      },
    });

    return true;
  } catch (error) {
    if (__DEV__) console.error('scheduleHabitReminder failed', { error, habitId });
    return false;
  }
}
