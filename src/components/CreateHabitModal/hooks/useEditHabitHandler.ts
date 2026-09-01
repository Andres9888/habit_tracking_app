import { useCallback } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { formatReminderTime24 } from '../../../utils/notifications';
import { validateHabitName } from '../../../utils/validation';
import { cancelReminder, scheduleReminder } from './useHabitReminders';
import type { EditHabitData } from './useCreateHabitHandlers.types';

export function useEditHabitHandler() {
  const updateHabit = useMutation(api.habits.update);

  return useCallback(
    async (data: EditHabitData): Promise<void> => {
      const validation = validateHabitName(data.fullHabitName);
      if (!validation.isValid) {
        throw new Error(validation.error ?? 'Invalid habit name');
      }
      const name = validation.sanitized;
      let remindersEnabled = data.hasReminders;

      try {
        if (remindersEnabled) {
          const scheduled = await scheduleReminder({
            habitId: data.habitToEdit._id,
            habitName: name,
            reminderTime: data.reminderTime,
          });
          if (!scheduled) {
            remindersEnabled = false;
            await cancelReminder(data.habitToEdit._id);
          }
        } else {
          await cancelReminder(data.habitToEdit._id);
        }

        await updateHabit({
          color: data.selectedColor,
          daysOfWeek:
            data.selectedDays.length < 7 ? data.selectedDays : undefined,
          frequency: data.frequency || undefined,
          goalDuration: data.streakGoal > 0 ? data.streakGoal : undefined,
          habitId: data.habitToEdit._id,
          icon: data.selectedEmoji ?? undefined,
          iconColor: data.selectedColor,
          name,
          notes: data.habitToEdit.notes ?? '',
          preferredTime: data.dayPhase ?? undefined,
          progressEmojis: data.progressEmojis,
          reminderSound: remindersEnabled
            ? (data.reminderSound ?? undefined)
            : undefined,
          reminderTime: remindersEnabled
            ? formatReminderTime24(data.reminderTime)
            : undefined,
          remindersEnabled,
          strengthAlgorithm: data.strengthAlgorithm,
        });
      } catch (error) {
        if (__DEV__) console.error('Failed to edit habit:', error);
        throw error;
      }
    },
    [updateHabit]
  );
}
