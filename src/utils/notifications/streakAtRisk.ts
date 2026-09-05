/**
 * Streak-at-Risk Notifications
 *
 * Schedules a local notification in the evening when a habit hasn't been
 * completed yet today but has an active streak. This nudges users to
 * maintain their streak before the day ends.
 */

import * as Notifications from 'expo-notifications';

import { ANDROID_CHANNEL_ID } from './constants';
import { ensureNotificationPermissions } from './permissions';
import { cancelStreakAtRiskNotification } from './streakAtRiskCancel';
import {
  DEFAULT_REMINDER_HOUR,
  DEFAULT_REMINDER_MINUTE,
  buildStreakAtRiskContent,
  isAndroid,
  streakAtRiskIdentifier,
  tomorrowAt,
  type ScheduleStreakAtRiskParams,
} from './streakAtRiskContent';

export {
  cancelAllStreakAtRiskNotifications,
  cancelStreakAtRiskNotification,
} from './streakAtRiskCancel';
export { STREAK_RISK_PREFIX } from './streakAtRiskContent';
export type { ScheduleStreakAtRiskParams };

function androidChannel() {
  return isAndroid() ? { channelId: ANDROID_CHANNEL_ID } : {};
}

/**
 * Schedule a daily streak-at-risk notification for a habit.
 * Fires at the specified time (default 8 PM) every day.
 * The app should cancel this notification when the habit is completed.
 */
export async function scheduleStreakAtRiskNotification(
  params: ScheduleStreakAtRiskParams
): Promise<boolean> {
  const {
    habitId,
    hour = DEFAULT_REMINDER_HOUR,
    minute = DEFAULT_REMINDER_MINUTE,
  } = params;
  try {
    const hasPermission = await ensureNotificationPermissions();
    if (!hasPermission) return false;

    // Cancel any existing streak-at-risk notification for this habit
    await cancelStreakAtRiskNotification(habitId);

    await Notifications.scheduleNotificationAsync({
      content: buildStreakAtRiskContent(params),
      identifier: streakAtRiskIdentifier(habitId),
      trigger: {
        ...androidChannel(),
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
 * Schedule a one-shot streak-at-risk notification for tomorrow.
 *
 * Used when the habit is already done today: cancelling the daily repeat would
 * otherwise leave nothing scheduled, so the reminder only came back if the user
 * happened to open the app the next day before reminder time. Uses the same
 * identifier as the daily variant, so the next reschedule replaces it and
 * cancelStreakAtRiskNotification still clears it.
 */
export async function scheduleStreakAtRiskForTomorrow(
  params: ScheduleStreakAtRiskParams
): Promise<boolean> {
  const {
    habitId,
    hour = DEFAULT_REMINDER_HOUR,
    minute = DEFAULT_REMINDER_MINUTE,
  } = params;
  try {
    const hasPermission = await ensureNotificationPermissions();
    if (!hasPermission) return false;

    await cancelStreakAtRiskNotification(habitId);

    await Notifications.scheduleNotificationAsync({
      content: buildStreakAtRiskContent(params),
      identifier: streakAtRiskIdentifier(habitId),
      trigger: {
        ...androidChannel(),
        date: tomorrowAt(hour, minute),
        type: Notifications.SchedulableTriggerInputTypes.DATE,
      },
    });

    return true;
  } catch (error) {
    if (__DEV__)
      console.warn('scheduleStreakAtRiskForTomorrow failed', { error, habitId });
    return false;
  }
}
