/**
 * Test Notification
 *
 * Sends an immediate test notification so users can verify their setup works.
 */

import * as Notifications from 'expo-notifications';

import { ensureNotificationPermissions } from './permissions';

/**
 * Send a test notification to verify the notification pipeline works.
 * Returns true if the notification was scheduled, false if permissions were denied.
 */
export async function sendTestNotification(): Promise<boolean> {
  try {
    const hasPermission = await ensureNotificationPermissions();
    if (!hasPermission) return false;

    await Notifications.scheduleNotificationAsync({
      content: {
        body: "If you're seeing this, notifications are working perfectly! 🎉",
        data: { type: 'test' },
        sound: 'default',
        title: '🔔 Notifications are working!',
      },
      trigger: {
        seconds: 2,
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      },
    });

    return true;
  } catch (error) {
    if (__DEV__) console.warn('sendTestNotification failed', error);
    return false;
  }
}
