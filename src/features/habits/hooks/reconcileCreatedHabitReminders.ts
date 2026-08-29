import { Platform } from 'react-native';
import { scheduleHabitReminder } from '../../../utils/notifications';
import type { ReconciledHabitCreation } from './optimisticHabitCreationStore.types';

function parseReminderTime(value: string): Date | null {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);
  if (!match) return null;
  const reminderTime = new Date();
  reminderTime.setHours(Number(match[1]), Number(match[2]), 0, 0);
  return reminderTime;
}

export async function reconcileCreatedHabitReminders(
  matches: ReconciledHabitCreation[]
): Promise<void> {
  if (Platform.OS === 'web') return;
  await Promise.all(
    matches.map(async ({ serverHabit, tempHabit }) => {
      if (!tempHabit.remindersEnabled || !tempHabit.reminderTime) return;
      const reminderTime = parseReminderTime(tempHabit.reminderTime);
      if (!reminderTime) return;
      await scheduleHabitReminder({
        body: 'Time to check in on your habit progress!',
        habitId: serverHabit._id,
        reminderTime,
        skipPermissionCheck: true,
        title: serverHabit.name,
      });
    })
  );
}
