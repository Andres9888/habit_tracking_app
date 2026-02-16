import * as Notifications from 'expo-notifications';

import { NOTIFICATION_TYPE_LETTER_UNLOCK } from '../constants';

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
      if (__DEV__) console.info('cancelLetterUnlockNotification: cancelled', {
        count: toCancel.length,
        letterId,
      });
    }
  } catch (error) {
    if (__DEV__) console.warn('cancelLetterUnlockNotification failed', { error, letterId });
  }
}
