import * as Notifications from 'expo-notifications';

import { NOTIFICATION_TYPE_AFFIRMATION_DELIVERY } from '../constants';

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

    if (toCancel.length > 0 && __DEV__) {
      // eslint-disable-next-line no-console
      console.info('cancelAffirmationDelivery: cancelled', {
        affirmationId,
        count: toCancel.length,
      });
    }
  } catch (error) {
    if (__DEV__) console.warn('cancelAffirmationDelivery failed', { affirmationId, error });
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

    if (toCancel.length > 0 && __DEV__) {
      // eslint-disable-next-line no-console
      console.info('cancelAllAffirmationDeliveriesForHabit: cancelled', {
        count: toCancel.length,
        habitId,
      });
    }
  } catch (error) {
    if (__DEV__) console.warn('cancelAllAffirmationDeliveriesForHabit failed', {
      error,
      habitId,
    });
  }
}
