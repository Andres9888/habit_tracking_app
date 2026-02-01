import * as Notifications from 'expo-notifications';

import { NOTIFICATION_TYPE_LETTER_UNLOCK } from '../constants';
import type { ScheduledLetterNotification } from '../types';

/**
 * Get all scheduled letter unlock notifications
 * Useful for debugging or displaying scheduled notifications to the user
 */
export async function getScheduledLetterUnlockNotifications(): Promise<
  ScheduledLetterNotification[]
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
    if (__DEV__)
      console.error('getScheduledLetterUnlockNotifications failed', error);
    return [];
  }
}
