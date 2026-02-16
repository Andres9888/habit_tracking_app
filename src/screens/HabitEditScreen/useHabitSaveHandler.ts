import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import {
  cancelHabitReminder,
  ensureNotificationPermissions,
  formatReminderTime,
  scheduleHabitReminder,
} from '../../utils/notifications';
import { showSaveError } from '../../utils/errorAlerts';

interface UseSaveHandlerProps {
  habitId: Id<'habits'> | null;
  habitName: string;
  selectedEmoji: string | null;
  selectedColor: string;
  remindersEnabled: boolean;
  reminderTime: Date;
  restDays?: number[];
  onSuccess: () => void;
}

export function useHabitSaveHandler({
  habitId,
  habitName,
  selectedEmoji,
  selectedColor,
  remindersEnabled,
  reminderTime,
  restDays,
  onSuccess,
}: UseSaveHandlerProps) {
  const updateHabit = useMutation(api.habits.update);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = useCallback(async () => {
    if (!habitId || !habitName.trim() || isSaving) return;

    setIsSaving(true);

    const trimmedName = habitName.trim();
    const fullName = selectedEmoji
      ? `${selectedEmoji} ${trimmedName}`
      : trimmedName;
    const reminderTimeString = formatReminderTime(reminderTime);

    let enableReminders = remindersEnabled;

    try {
      if (remindersEnabled) {
        const hasPermission = await ensureNotificationPermissions();
        enableReminders = hasPermission;

        if (hasPermission) {
          const scheduled = await scheduleHabitReminder({
            body: 'Time to check in on your habit progress!',
            habitId: String(habitId),
            reminderTime,
            skipPermissionCheck: true,
            title: fullName,
          });
          enableReminders = scheduled;
        }

        if (!enableReminders) {
          await cancelHabitReminder(String(habitId));
          Alert.alert(
            'Notifications Disabled',
            'Enable notifications in your device settings to receive habit reminders.'
          );
        }
      } else {
        await cancelHabitReminder(String(habitId));
      }

      await updateHabit({
        habitId,
        icon: selectedEmoji ?? undefined,
        color: selectedColor,
        iconColor: selectedColor,
        name: fullName,
        remindersEnabled: enableReminders,
        reminderSound: enableReminders ? 'default' : undefined,
        reminderTime: enableReminders ? reminderTimeString : undefined,
        restDays: restDays && restDays.length > 0 ? restDays : undefined,
      });

      onSuccess();
    } catch (error) {
      if (__DEV__) console.error('Failed to save habit:', error);
      showSaveError(() => void handleSave());
    } finally {
      setIsSaving(false);
    }
  }, [
    isSaving,
    habitId,
    habitName,
    selectedEmoji,
    selectedColor,
    remindersEnabled,
    reminderTime,
    restDays,
    updateHabit,
    onSuccess,
  ]);

  return { handleSave, isSaving };
}
