import * as Notifications from 'expo-notifications';

import { NOTIFICATION_TYPE_AFFIRMATION_DELIVERY } from '../constants';

import type {
  AffirmationFrequency,
  ScheduledAffirmationDelivery,
} from './types';

/**
 * Get all scheduled affirmation delivery notifications
 * Useful for debugging or displaying scheduled notifications to the user
 */
export async function getScheduledAffirmationDeliveries(): Promise<
  ScheduledAffirmationDelivery[]
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
    return [];
  }
}
