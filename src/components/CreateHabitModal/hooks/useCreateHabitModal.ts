import { useCallback } from 'react';
import type { CreateHabitModalProps } from '../types';
import { useHabitForm } from './useHabitForm';
import useHapticFeedback from '../../../hooks/useHapticFeedback';
import { checkReminderPermissions } from './useHabitReminders';
import { useCreateHabitHandlers } from './useCreateHabitHandlers';
import {
  useVisibilityReset,
  useHabitData,
  useModalCleanup,
} from './useCreateHabitModalEffects';

export const useCreateHabitModal = (props: CreateHabitModalProps) => {
  const { visible, onClose, habitToEdit } = props;
  const isEditMode = !!habitToEdit;
  const form = useHabitForm({ habitToEdit });
  const { triggerSuccess } = useHapticFeedback();
  const { handleEdit, handleCreate: createNewHabit } = useCreateHabitHandlers();

  useVisibilityReset({
    isEditMode,
    resetForm: form.resetForm,
    visible,
  });

  const habitData = useHabitData({
    dayPhase: form.dayPhase,
    frequency: form.frequency,
    fullHabitName: form.fullHabitName,
    reminderSound: form.reminderSound,
    reminderTime: form.reminderTime,
    selectedColor: form.selectedColor,
    selectedDays: form.selectedDays,
    selectedEmoji: form.selectedEmoji,
  });

  const cleanup = useModalCleanup({
    closeColorPicker: form.closeColorPicker,
    onClose,
    resetForm: form.resetForm,
    setShowTimePicker: form.setShowTimePicker,
    triggerSuccess,
  });

  const handleCreate = useCallback(async () => {
    if (!form.habitName.trim() || !form.fullHabitName) return;
    try {
      const { hasReminders } = await checkReminderPermissions(
        form.remindersEnabled
      );
      const data = { ...habitData, hasReminders };

      await (isEditMode && habitToEdit
        ? handleEdit({ ...data, habitToEdit })
        : createNewHabit(data));
      cleanup();
    } catch (error) {
      if (__DEV__) console.error('Failed to save habit:', error);
    }
  }, [
    form.habitName,
    form.fullHabitName,
    form.remindersEnabled,
    habitData,
    isEditMode,
    habitToEdit,
    handleEdit,
    createNewHabit,
    cleanup,
  ]);

  return { form, handleCreate, isEditMode };
};
