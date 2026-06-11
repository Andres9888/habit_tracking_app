import { useCallback, useRef } from 'react';
import type { CreateHabitModalProps } from '../types';
import { useHabitForm } from './useHabitForm';
import useHapticFeedback from '../../../hooks/useHapticFeedback';
import { checkReminderPermissions } from './useHabitReminders';
import { useCreateHabitHandlers } from './useCreateHabitHandlers';
import { showCreateError } from '../../../utils/errorAlerts';
import {
  useHabitData,
  useModalCleanup,
} from './useCreateHabitModalEffects';
import { EXIT_DURATIONS } from '../../Modal/Modal.constants';

export const useCreateHabitModal = (props: CreateHabitModalProps) => {
  const { visible, onClose, habitToEdit } = props;
  const isEditMode = !!habitToEdit;
  const form = useHabitForm({ habitToEdit });
  const { triggerSuccess } = useHapticFeedback();
  const { handleEdit, handleCreate: createNewHabit } = useCreateHabitHandlers();
  const isSaving = useRef(false);

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
    progressEmojis: form.progressEmojis,
    streakGoal: form.streakGoal,
  });

  const cleanup = useModalCleanup({
    closeColorPicker: form.closeColorPicker,
    onClose,
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
        await handleEdit({ ...data, habitToEdit });
        cleanup();
      } else {
        cleanup();
        setTimeout(form.resetForm, EXIT_DURATIONS.fullScreen);
        // On failure the optimistic habit rolls back, so tell the user why
        // and offer a retry instead of letting it vanish silently.
        const runCreate = () => {
          void createNewHabit(data).catch(() => showCreateError(runCreate));
        };
        runCreate();
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
    form.resetForm,
  ]);

  return { form, handleCreate, isEditMode };
};
