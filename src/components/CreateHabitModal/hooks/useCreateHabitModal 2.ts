import { useCallback, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import {
  cancelHabitReminder,
  ensureNotificationPermissions,
  formatReminderTime,
  scheduleHabitReminder,
} from '../../../utils/notifications';
import { DEFAULT_EMOJI } from '../constants';
import type { CreateHabitModalProps, HabitTemplate } from '../types';
import { useHabitForm } from './useHabitForm';
import { useScienceModal } from './useScienceModal';
import { useTemplateBrowser } from './useTemplateBrowser';
import useHapticFeedback from '../../../hooks/useHapticFeedback';
const extractTemplateDetails = (template: HabitTemplate) => {
  const emoji = template.icon?.match(/\p{Emoji}/u)?.[0] ?? template.icon ?? DEFAULT_EMOJI;
  const name = template.name.replace(/^\p{Emoji}\s*/u, '').trim();
  return { emoji, name };
};
export const useCreateHabitModal = ({ visible, onClose, habitToEdit }: CreateHabitModalProps) => {
  const isEditMode = !!habitToEdit;
  const form = useHabitForm({ habitToEdit });
  const { triggerSuccess } = useHapticFeedback();
  const {
    closeColorPicker,
    dayPhase,
    fullHabitName,
    habitName,
    reminderSound,
    reminderTime,
    remindersEnabled,
    resetForm,
    selectedColor,
    selectedEmoji,
    setFrequency,
    setHabitName,
    setSelectedColor,
    setSelectedEmoji,
    setShowTimePicker,
  } = form;
  const createHabit = useMutation(api.habits.create);
  const updateHabit = useMutation(api.habits.update);
  const applyTemplate = useCallback(
    (template: HabitTemplate) => {
      const { emoji, name } = extractTemplateDetails(template);
      setSelectedEmoji(emoji);
      setHabitName(name);
      if (template.iconColor) setSelectedColor(template.iconColor);
      if ((template as any)?.frequency) setFrequency((template as any).frequency);
    },
    [setHabitName, setSelectedColor, setSelectedEmoji, setFrequency]
  );

  const template = useTemplateBrowser({ isEditMode, visible, onTemplateSelect: applyTemplate });
  const science = useScienceModal({ onSelectTemplate: applyTemplate });
  const { reset: resetTemplateCategories, closeTemplateBrowser } = template;
  const { close: closeScienceModal } = science;

  useEffect(() => {
    if (!visible || isEditMode) return;
    resetForm();
    resetTemplateCategories();
    closeTemplateBrowser();
    closeScienceModal();
  }, [
    visible,
    isEditMode,
    resetForm,
    resetTemplateCategories,
    closeTemplateBrowser,
    closeScienceModal,
  ]);
  const handleCreate = useCallback(async () => {
    if (!habitName.trim() || !fullHabitName) return;

    let hasReminders = remindersEnabled;
    if (remindersEnabled) {
      if (Platform.OS === 'web') {
        Alert.alert(
          'Reminders on Mobile Only',
          'Local reminder notifications can only be scheduled from the iOS/Android app. Your reminder settings will be saved.'
        );
      } else {
        const allowed = await ensureNotificationPermissions();
        if (!allowed) {
          hasReminders = false;
          Alert.alert(
            'Notifications Disabled',
            'Enable notifications in your device settings to receive habit reminders.'
          );
        }
      }
    }

    if (isEditMode && habitToEdit) {
      if (hasReminders) {
        if (Platform.OS !== 'web') {
          const scheduled = await scheduleHabitReminder({
            body: 'Time to check in on your habit progress!',
            habitId: habitToEdit._id,
            reminderTime,
            skipPermissionCheck: true,
            title: fullHabitName,
          });

          if (!scheduled) {
            hasReminders = false;
            Alert.alert(
              'Reminder Not Scheduled',
              'We could not schedule this reminder on this device. Your reminder settings were saved.'
            );
            await cancelHabitReminder(habitToEdit._id);
          }
        }
      } else {
        if (Platform.OS !== 'web') {
          await cancelHabitReminder(habitToEdit._id);
        }
      }

      await updateHabit({
        habitId: habitToEdit._id,
        icon: selectedEmoji ?? undefined,
        iconColor: selectedColor,
        name: fullHabitName,
        notes: habitToEdit.notes ?? '',
        preferredTime: dayPhase ?? undefined,
        remindersEnabled: hasReminders,
        reminderSound: hasReminders ? reminderSound : undefined,
        reminderTime: hasReminders ? formatReminderTime(reminderTime) : undefined,
      });
    } else {
      const habitId = await createHabit({
        icon: selectedEmoji ?? undefined,
        iconColor: selectedColor,
        name: fullHabitName,
        notes: '',
        preferredTime: dayPhase ?? undefined,
        remindersEnabled: hasReminders,
        reminderSound: hasReminders ? reminderSound : undefined,
        reminderTime: hasReminders ? formatReminderTime(reminderTime) : undefined,
      });
      if (hasReminders && habitId && Platform.OS !== 'web') {
        const scheduled = await scheduleHabitReminder({
          body: 'Time to check in on your habit progress!',
          habitId,
          reminderTime,
          skipPermissionCheck: true,
          title: fullHabitName,
        });

        if (!scheduled) {
          Alert.alert(
            'Reminder Not Scheduled',
            'We could not schedule this reminder on this device. Your reminder settings were saved.'
          );
        }
      }
    }

    resetForm();
    closeColorPicker();
    setShowTimePicker(false);
    template.reset();
    template.closeTemplateBrowser();
    science.close();
    triggerSuccess();
    onClose();
  }, [createHabit, closeColorPicker, dayPhase, habitToEdit, isEditMode, onClose, reminderSound, reminderTime, remindersEnabled, resetForm, science, selectedColor, selectedEmoji, setShowTimePicker, template, updateHabit, fullHabitName]);

  return { isEditMode, form, template, science, handleCreate };
};
