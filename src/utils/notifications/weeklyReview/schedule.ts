/**
 * Weekly Review Notification Scheduling
 *
 * Schedules a push notification every Sunday at 6 PM local time:
 * "Your weekly habit review is ready 📊"
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { configureWeeklyReviewChannel } from '../channels';
import {
  ANDROID_WEEKLY_REVIEW_CHANNEL_ID,
  NOTIFICATION_TYPE_WEEKLY_REVIEW,
} from '../constants';
import { ensureNotificationPermissions } from '../permissions';

const WEEKLY_REVIEW_NOTIFICATION_ID = 'weekly-review-sunday';

/**
 * Schedule the recurring weekly review notification for Sunday 6 PM.
 * Cancels any existing one first to avoid duplicates.
 */
export async function scheduleWeeklyReviewNotification(): Promise<string | null> {
  try {
    const hasPermission = await ensureNotificationPermissions();
    if (!hasPermission) return null;

    await configureWeeklyReviewChannel();

    // Cancel existing
    await cancelWeeklyReviewNotification();

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '📊 Weekly Review Ready',
        body: 'Your weekly habit review is ready — see your wins, streaks, and insights!',
        data: {
          type: NOTIFICATION_TYPE_WEEKLY_REVIEW,
        },
        sound: 'default',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: 1, // Sunday (Expo uses 1=Sunday)
        hour: 18,
        minute: 0,
        ...(Platform.OS === 'android'
          ? { channelId: ANDROID_WEEKLY_REVIEW_CHANNEL_ID }
          : {}),
      },
    });

    console.info('scheduleWeeklyReviewNotification success', { notificationId });
    return notificationId;
  } catch (error) {
    if (__DEV__) console.error('scheduleWeeklyReviewNotification failed', error);
    return null;
  }
}

/**
 * Cancel the weekly review notification.
 */
export async function cancelWeeklyReviewNotification(): Promise<void> {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const reviewNotifications = scheduled.filter(
      (n) => n.content.data?.type === NOTIFICATION_TYPE_WEEKLY_REVIEW
    );
    for (const n of reviewNotifications) {
      await Notifications.cancelScheduledNotificationAsync(n.identifier);
    }
  } catch (error) {
    if (__DEV__) console.error('cancelWeeklyReviewNotification failed', error);
  }
}
