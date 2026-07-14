import * as Notifications from 'expo-notifications';

import {
  getHabitReminderNotificationIdentifier,
  scheduleHabitReminder,
} from './habitReminders';
import { hasNotificationPermissions } from './permissions';
import { createDateFromTimeString } from './timeUtils';

const HABIT_REMINDER_BODY = 'Time to check in on your habit progress!';

export type ReconcileHabitReminder = {
  _id: string;
  name: string;
  remindersEnabled?: boolean;
  reminderTime?: string;
};

type ScheduledHabitReminder = {
  hour?: number;
  minute?: number;
};

export type HabitReminderReconciliationResult = {
  canceled: number;
  scheduled: number;
};

function getScheduledReminderTime(
  notification: Notifications.NotificationRequest
): ScheduledHabitReminder | null {
  const trigger = notification.trigger as
    | (ScheduledHabitReminder & { repeats?: boolean })
    | null
    | undefined;
  if (
    !trigger ||
    typeof trigger.hour !== 'number' ||
    typeof trigger.minute !== 'number'
  ) {
    return null;
  }

  return { hour: trigger.hour, minute: trigger.minute };
}

function getScheduledHabitReminderId(
  notification: Notifications.NotificationRequest
): string | null {
  if (notification.identifier.startsWith('habit-reminder-')) {
    return notification.identifier.replace('habit-reminder-', '');
  }

  const data = notification.content?.data as
    | Record<string, unknown>
    | undefined;
  const habitId = data?.habitId;
  const isHabitReminder =
    data?.type === 'habitReminder' || data?.type === undefined;
  return isHabitReminder && typeof habitId === 'string' ? habitId : null;
}

function reminderMatchesHabit(
  notification: Notifications.NotificationRequest,
  habit: ReconcileHabitReminder
): boolean {
  if (notification.identifier !== getHabitReminderNotificationIdentifier(habit._id)) {
    return false;
  }

  const scheduled = getScheduledReminderTime(notification);
  if (!scheduled) return false;

  const reminderTime = createDateFromTimeString(habit.reminderTime);
  return (
    scheduled.hour === reminderTime.getHours() &&
    scheduled.minute === reminderTime.getMinutes()
  );
}

export async function reconcileHabitReminders(
  habits: ReconcileHabitReminder[]
): Promise<HabitReminderReconciliationResult> {
  const hasPermission = await hasNotificationPermissions();
  if (!hasPermission) return { canceled: 0, scheduled: 0 };

  const scheduledNotifications =
    await Notifications.getAllScheduledNotificationsAsync();
  const enabledHabits = habits.filter(
    (habit) => habit.remindersEnabled && habit.reminderTime
  );
  const enabledIds = new Set(enabledHabits.map((habit) => String(habit._id)));
  const staleReminderIds = scheduledNotifications
    .filter((notification) => {
      const habitId = getScheduledHabitReminderId(notification);
      return habitId !== null && !enabledIds.has(habitId);
    })
    .map((notification) => notification.identifier);

  await Promise.all(
    staleReminderIds.map((identifier) =>
      Notifications.cancelScheduledNotificationAsync(identifier)
    )
  );

  let scheduled = 0;
  for (const habit of enabledHabits) {
    const existing = scheduledNotifications.find((notification) =>
      reminderMatchesHabit(notification, habit)
    );
    if (existing) continue;

    const didSchedule = await scheduleHabitReminder({
      body: HABIT_REMINDER_BODY,
      habitId: String(habit._id),
      reminderTime: createDateFromTimeString(habit.reminderTime),
      skipPermissionCheck: true,
      title: habit.name,
    });
    if (didSchedule) scheduled += 1;
  }

  return { canceled: staleReminderIds.length, scheduled };
}
