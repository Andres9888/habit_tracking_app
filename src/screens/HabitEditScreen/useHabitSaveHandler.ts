import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import {
  cancelHabitReminder,
  ensureNotificationPermissions,
  formatReminderTime24,
  scheduleHabitReminder,
} from '../../utils/notifications';
import { showSaveError } from '../../utils/errorAlerts';

interface UseSaveHandlerProps {
  goalDuration: number | null;
  habitId: Id<'habits'> | null;
  habitName: string;
  selectedEmoji: string | null;
  selectedColor: string;
  remindersEnabled: boolean;
  reminderTime: Date;
  onSuccess: () => void;
}

export function useHabitSaveHandler({
  goalDuration,
  habitId,
  habitName,
  selectedEmoji,
  selectedColor,
  remindersEnabled,
  reminderTime,
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
    const reminderTimeString = formatReminderTime24(reminderTime);

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
        goalDuration: goalDuration ?? undefined,
        goalUnit: goalDuration ? 'streak_days' : undefined,
        habitId,
        icon: selectedEmoji ?? undefined,
        color: selectedColor,
        iconColor: selectedColor,
        name: fullName,
        remindersEnabled: enableReminders,
        reminderSound: enableReminders ? 'default' : undefined,
        reminderTime: enableReminders ? reminderTimeString : undefined,
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
    goalDuration,
    habitId,
    habitName,
    selectedEmoji,
    selectedColor,
    remindersEnabled,
    reminderTime,
    updateHabit,
    onSuccess,
  ]);

  return { handleSave, isSaving };
}
