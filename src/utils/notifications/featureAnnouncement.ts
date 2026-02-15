/**
 * Feature Announcement Notifications
 *
 * Local notifications for announcing new features, tips, and app updates.
 * Uses a low-priority Android channel to avoid being intrusive.
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const ANNOUNCEMENT_CHANNEL_ID = 'feature-announcements';
const ANNOUNCEMENT_PREFIX = 'announcement-';

export interface FeatureAnnouncementParams {
  id: string;
  title: string;
  body: string;
  /** Optional deep-link data */
  data?: Record<string, string>;
  /** Delay in seconds before showing (default: 0 = immediate) */
  delaySec?: number;
}

/**
 * Configure Android notification channel for feature announcements
 */
export async function configureAnnouncementChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;

  try {
    await Notifications.setNotificationChannelAsync(ANNOUNCEMENT_CHANNEL_ID, {
      importance: Notifications.AndroidImportance.DEFAULT,
      lightColor: '#059669',
      name: 'Tips & Updates',
      sound: 'default',
      vibrationPattern: [0, 200],
    });
  } catch (error) {
    if (__DEV__) console.error('Failed to configure announcement channel:', error);
  }
}

/**
 * Send a feature announcement notification
 */
export async function sendFeatureAnnouncement({
  id,
  title,
  body,
  data,
  delaySec = 0,
}: FeatureAnnouncementParams): Promise<boolean> {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        body,
        data: {
          ...data,
          announcementId: id,
          type: 'featureAnnouncement',
        },
        sound: 'default',
        title,
      },
      identifier: `${ANNOUNCEMENT_PREFIX}${id}`,
      trigger:
        delaySec > 0
          ? {
              ...(Platform.OS === 'android'
                ? { channelId: ANNOUNCEMENT_CHANNEL_ID }
                : {}),
              seconds: delaySec,
              type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            }
          : null,
    });

    return true;
  } catch (error) {
    if (__DEV__) console.warn('sendFeatureAnnouncement failed', { error, id });
    return false;
  }
}

/**
 * Cancel a specific announcement notification
 */
export async function cancelFeatureAnnouncement(id: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(
      `${ANNOUNCEMENT_PREFIX}${id}`
    );
  } catch {
    // May not exist
  }
}
