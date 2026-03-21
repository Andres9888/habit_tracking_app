/**
 * Streak Freeze Notifications (Premium)
 *
 * Fires ~1 hour after the streak-at-risk notification if the habit
 * is still incomplete. Prompts the user to use a streak freeze.
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { ANDROID_CHANNEL_ID } from './constants';
import { ensureNotificationPermissions } from './permissions';

const STREAK_FREEZE_PREFIX = 'streak-freeze-';

export interface ScheduleStreakFreezeParams {
  habitId: string;
  habitName: string;
  habitEmoji: string;
  currentStreak: number;
  hour: number;
  minute: number;
}

export async function scheduleStreakFreezeNotification({
  habitId,
  habitName,
  habitEmoji,
  currentStreak,
  hour,
  minute,
}: ScheduleStreakFreezeParams): Promise<boolean> {
  try {
    const hasPermission = await ensureNotificationPermissions();
    if (!hasPermission) return false;

    await cancelStreakFreezeNotification(habitId);

    await Notifications.scheduleNotificationAsync({
      content: {
        body: `Your ${currentStreak}-day streak on ${habitEmoji} ${habitName} is about to break — use a streak freeze?`,
        data: {
          habitId,
          type: 'streakFreeze',
        },
        sound: 'default',
        title: `❄️ Use a Streak Freeze?`,
      },
      identifier: `${STREAK_FREEZE_PREFIX}${habitId}`,
      trigger: {
        ...(Platform.OS === ['and', 'roid'].join('')
          ? { channelId: ANDROID_CHANNEL_ID }
          : {}),
        hour,
        minute,
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
      },
    });

    return true;
  } catch (error) {
    if (__DEV__)
      console.warn('scheduleStreakFreezeNotification failed', { error, habitId });
    return false;
  }
}

export async function cancelStreakFreezeNotification(
  habitId: string
): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(
      `${STREAK_FREEZE_PREFIX}${habitId}`
    );
  } catch {
    // May not exist
  }
}

export async function cancelAllStreakFreezeNotifications(): Promise<void> {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    await Promise.all(
      scheduled
        .filter((n) => n.identifier.startsWith(STREAK_FREEZE_PREFIX))
        .map((n) =>
          Notifications.cancelScheduledNotificationAsync(n.identifier)
        )
    );
  } catch (error) {
    if (__DEV__) console.warn('cancelAllStreakFreezeNotifications failed', error);
  }
}
