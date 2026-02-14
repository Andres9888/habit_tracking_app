import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { configureLetterUnlockChannel } from '../channels';
import {
  ANDROID_LETTER_CHANNEL_ID,
  NOTIFICATION_TYPE_LETTER_UNLOCK,
} from '../constants';
import { ensureNotificationPermissions } from '../permissions';
import type { ScheduleLetterUnlockParams } from '../types';

import { cancelLetterUnlockNotification } from './cancel';
import { logLetterNotificationError } from './logError';

/**
 * Schedule a notification for when a letter unlocks
 *
 * Uses a DATE trigger for one-time notification at exact unlock time.
 * Notification data includes type='letterUnlock' to differentiate from habit reminders.
 *
 * @returns Notification identifier string on success, null on failure
 */
export async function scheduleLetterUnlockNotification({
  letterId,
  habitId,
  letterTitle = 'Letter to Self',
  unlockAt,
  skipPermissionCheck = false,
}: ScheduleLetterUnlockParams): Promise<string | null> {
  try {
    // Don't schedule if unlock time is in the past
    if (unlockAt <= Date.now()) {
      if (__DEV__) console.warn(
        'scheduleLetterUnlockNotification: unlock time is in the past',
        { letterId, unlockAt }
      );
      return null;
    }

    if (skipPermissionCheck) {
      await configureLetterUnlockChannel();
    } else {
      const hasPermission = await ensureNotificationPermissions();

      if (!hasPermission) {
        return null;
      }

      await configureLetterUnlockChannel();
    }

    // Cancel any existing notification for this letter
    await cancelLetterUnlockNotification(letterId);

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        body: 'Your letter to yourself is ready to read!',
        data: {
          habitId,
          letterId,
          type: NOTIFICATION_TYPE_LETTER_UNLOCK,
        },
        sound: 'default',
        title: `📬 ${letterTitle}`,
      },
      trigger: {
        ...(Platform.OS === 'android'
          ? { channelId: ANDROID_LETTER_CHANNEL_ID }
          : {}),
        date: new Date(unlockAt),
        type: Notifications.SchedulableTriggerInputTypes.DATE,
      },
    });

    // eslint-disable-next-line no-console
    console.info('scheduleLetterUnlockNotification success', {
      letterId,
      notificationId,
      unlockAt: new Date(unlockAt).toISOString(),
    });

    return notificationId;
  } catch (error: unknown) {
    logLetterNotificationError('scheduleLetterUnlockNotification', error, {
      letterId,
    });
    return null;
  }
}
