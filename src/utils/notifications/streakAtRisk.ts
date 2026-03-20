/**
 * Streak-at-Risk Notifications
 *
 * Schedules a local notification in the evening when a habit hasn't been
 * completed yet today but has an active streak. This nudges users to
 * maintain their streak before the day ends.
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { ANDROID_CHANNEL_ID } from './constants';
import { ensureNotificationPermissions } from './permissions';

/** Notification identifier prefix for streak-at-risk alerts */
const STREAK_RISK_PREFIX = 'streak-risk-';

export interface ScheduleStreakAtRiskParams {
  habitId: string;
  habitName: string;
  habitEmoji?: string;
  currentStreak: number;
  /** Hour (0-23) to fire the reminder. Default: 20 (8 PM) */
  hour?: number;
  /** Minute (0-59). Default: 0 */
  minute?: number;
}

/**
 * Schedule a daily streak-at-risk notification for a habit.
 * Fires at the specified time (default 8 PM) every day.
 * The app should cancel this notification when the habit is completed.
 */
export async function scheduleStreakAtRiskNotification({
  habitId,
  habitName,
  habitEmoji = '🔥',
  currentStreak,
  hour = 20,
  minute = 0,
}: ScheduleStreakAtRiskParams): Promise<boolean> {
  try {
    const hasPermission = await ensureNotificationPermissions();
    if (!hasPermission) return false;

    // Cancel any existing streak-at-risk notification for this habit
    await cancelStreakAtRiskNotification(habitId);

    const streakText =
      currentStreak >= 7
        ? `${currentStreak}-day streak`
        : `${currentStreak} day streak`;

    await Notifications.scheduleNotificationAsync({
      content: {
        body: `Don't break your ${streakText}! Tap to complete ${habitName} before midnight.`,
        data: {
          habitId,
          type: 'streakAtRisk',
        },
        sound: 'default',
        title: `${habitEmoji} ${habitName} — Streak at risk!`,
      },
      identifier: `${STREAK_RISK_PREFIX}${habitId}`,
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
      console.warn('scheduleStreakAtRiskNotification failed', {
        error,
        habitId,
      });
    return false;
  }
}

/**
 * Cancel the streak-at-risk notification for a specific habit.
 * Call this when the user completes the habit for today.
 */
export async function cancelStreakAtRiskNotification(
  habitId: string
): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(
      `${STREAK_RISK_PREFIX}${habitId}`
    );
  } catch {
    // Notification may not exist; that's fine
  }
}

/**
 * Cancel all streak-at-risk notifications.
 */
export async function cancelAllStreakAtRiskNotifications(): Promise<void> {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const streakRiskNotifications = scheduled.filter((n) =>
      n.identifier.startsWith(STREAK_RISK_PREFIX)
    );
    await Promise.all(
      streakRiskNotifications.map((n) =>
        Notifications.cancelScheduledNotificationAsync(n.identifier)
      )
    );
  } catch (error) {
    if (__DEV__ && __DEV__) console.warn('cancelAllStreakAtRiskNotifications failed', error);
  }
}
