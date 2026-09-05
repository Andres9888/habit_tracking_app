/**
 * Cancellation half of the streak-at-risk notifications.
 *
 * Kept apart from the scheduling half so both files stay inside the 100-line
 * budget. Both variants (daily repeat and the one-shot for tomorrow) share the
 * STREAK_RISK_PREFIX identifier scheme, so these clear either one.
 */

import * as Notifications from 'expo-notifications';

import {
  STREAK_RISK_PREFIX,
  streakAtRiskIdentifier,
} from './streakAtRiskContent';

/**
 * Cancel the streak-at-risk notification for a specific habit.
 * Call this when the user completes the habit for today.
 */
export async function cancelStreakAtRiskNotification(
  habitId: string
): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(
      streakAtRiskIdentifier(habitId)
    );
  } catch {
    // Notification may not exist; that's fine
  }
}

/** Cancel all streak-at-risk notifications. */
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
    if (__DEV__)
      console.warn('cancelAllStreakAtRiskNotifications failed', error);
  }
}
