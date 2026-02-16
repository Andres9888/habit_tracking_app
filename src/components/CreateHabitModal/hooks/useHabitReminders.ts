/**
 * useHabitReminders - Handle reminder scheduling and cancellation
 *
 * @description
 * Provides utilities for managing habit reminder notifications.
 * Handles permission checks, scheduling, and cancellation.
 *
 * @role Reminder Manager
 * This module manages the reminder lifecycle:
 * 1. Check notification permissions
 * 2. Schedule daily reminders for habits
 * 3. Cancel reminders when disabled
 * 4. Show platform-appropriate alerts
 *
 * @platform Platform-Specific Behavior
 * - **iOS/Android**: Full reminder support with permissions
 * - **Web**: Reminders disabled (saves settings but doesn't schedule)
 *
 * @permissions
 * On mobile, prompts user for notification permissions if not granted.
 * If denied, habit is saved but reminders are disabled.
 *
 * @see {@link scheduleHabitReminder} - Low-level scheduling
 * @see {@link ensureNotificationPermissions} - Permission check
 * @see {@link useCreateHabitHandlers} - Calls these functions
 *
 * @module CreateHabitModal/hooks
 */
import { Alert, Platform } from 'react-native';
import {
  cancelHabitReminder,
  ensureNotificationPermissions,
  scheduleHabitReminder,
} from '../../../utils/notifications';
import type { Id } from '../../../../convex/_generated/dataModel';

interface ScheduleReminderParams {
  habitId: Id<'habits'>;
  habitName: string;
  reminderTime: Date;
}

interface ReminderCheckResult {
  hasReminders: boolean;
  shouldProceed: boolean;
}

/** Check reminder permissions and show appropriate alerts */
export async function checkReminderPermissions(
  remindersEnabled: boolean
): Promise<ReminderCheckResult> {
  if (!remindersEnabled) {
    return { hasReminders: false, shouldProceed: true };
  }

  if (Platform.OS === 'web') {
    Alert.alert(
      'Reminders on Mobile Only',
      'Local reminder notifications can only be scheduled from the iOS/Android app. Your reminder settings will be saved.'
    );
    return { hasReminders: true, shouldProceed: true };
  }

  const allowed = await ensureNotificationPermissions();
  if (!allowed) {
    Alert.alert(
      'Notifications Disabled',
      'Enable notifications in your device settings to receive habit reminders.'
    );
    return { hasReminders: false, shouldProceed: true };
  }

  return { hasReminders: true, shouldProceed: true };
}

/** Schedule a reminder for a habit */
export async function scheduleReminder({
  habitId,
  habitName,
  reminderTime,
}: ScheduleReminderParams): Promise<boolean> {
  if (Platform.OS === 'web') return true;

  try {
    const scheduled = await scheduleHabitReminder({
      body: 'Time to check in on your habit progress!',
      habitId,
      reminderTime,
      skipPermissionCheck: true,
      title: habitName,
    });

    if (!scheduled) {
      Alert.alert(
        'Reminder Not Scheduled',
        'We could not schedule this reminder on this device. Your reminder settings were saved.'
      );
    }

    return scheduled;
  } catch (error) {
    if (__DEV__) console.error('Failed to schedule reminder:', error);
    return false;
  }
}

/** Cancel a reminder for a habit */
export async function cancelReminder(habitId: Id<'habits'>): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    await cancelHabitReminder(habitId);
  } catch (error) {
    if (__DEV__) console.error('Failed to cancel reminder:', error);
  }
}
