import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { configureAndroidChannel } from './channels';
import { ANDROID_CHANNEL_ID } from './constants';
import { ensureNotificationPermissions } from './permissions';
import { generateSmartNotification, type NotificationContext } from './smartMessages';
import type { ScheduleHabitReminderParams } from './types';

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
    if (__DEV__) console.error('scheduleHabitReminder failed', { error, habitId });
    return false;
  }
}

/**
 * Schedule a smart habit reminder with context-aware messaging
 * 
 * This function generates dynamic notification copy based on:
 * - Current streak
 * - Time of day
 * - Days since last completion
 * - Upcoming milestones
 * 
 * Falls back to the basic scheduleHabitReminder if context is incomplete.
 */
export async function scheduleSmartHabitReminder(
  params: ScheduleHabitReminderParams & {
    context?: Partial<NotificationContext>;
  }
): Promise<boolean> {
  const { habitId, title, reminderTime, skipPermissionCheck = false, context } = params;

  // If context is provided, generate smart message
  if (context && context.habitName) {
    const notificationContext: NotificationContext = {
      habitName: context.habitName,
      currentStreak: context.currentStreak,
      bestStreak: context.bestStreak,
      lastCompletedDate: context.lastCompletedDate,
      reminderTime,
    };

    const smartMessage = generateSmartNotification(notificationContext);

    return scheduleHabitReminder({
      habitId,
      title: smartMessage.title,
      body: smartMessage.body,
      reminderTime,
      skipPermissionCheck,
    });
  }

  // Fallback to basic reminder if no context
  return scheduleHabitReminder({
    habitId,
    title,
    body: 'Time to check in on your habit progress!',
    reminderTime,
    skipPermissionCheck,
  });
}
