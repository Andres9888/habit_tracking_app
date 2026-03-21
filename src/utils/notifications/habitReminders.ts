import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { configureAndroidChannel } from './channels';
import { ANDROID_CHANNEL_ID } from './constants';
import { ensureNotificationPermissions } from './permissions';
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
