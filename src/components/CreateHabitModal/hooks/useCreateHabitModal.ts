import { useCallback, useRef } from 'react';
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
  const isSaving = useRef(false);

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
    strengthAlgorithm: form.strengthAlgorithm,
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
    if (isSaving.current) return;
    isSaving.current = true;
    try {
      const { hasReminders } = await checkReminderPermissions(
        form.remindersEnabled
      );
      const data = { ...habitData, hasReminders };

      if (isEditMode && habitToEdit) {
        // Edit mode: await mutation before closing
        await handleEdit({ ...data, habitToEdit });
        cleanup();
      } else {
        // Create mode: close immediately, fire mutation in background
        cleanup();
        // Error already logged inside useCreateHabitHandlers
        void createNewHabit(data).catch(() => {});
      }
    } catch (error) {
      if (__DEV__) console.error('Failed to save habit:', error);
    } finally {
      isSaving.current = false;
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
