import { createDateFromTimeString } from './timeUtils';
import { scheduleHabitReminder } from './habitReminders';

const HABIT_REMINDER_BODY = 'Time to check in on your habit progress!';

export type HabitReminderSettings = {
  _id: string;
  name: string;
  remindersEnabled?: boolean;
  reminderTime?: string;
};

export async function rescheduleHabitReminderFromSettings(
  habit: HabitReminderSettings
): Promise<boolean> {
  if (!habit.remindersEnabled || !habit.reminderTime) {
    return false;
  }

  return scheduleHabitReminder({
    body: HABIT_REMINDER_BODY,
    habitId: String(habit._id),
    reminderTime: createDateFromTimeString(habit.reminderTime),
    skipPermissionCheck: true,
    title: habit.name,
  });
}
