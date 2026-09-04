import { useCallback, useRef } from 'react';
import type { CreateHabitModalProps } from '../types';
import { useHabitForm } from './useHabitForm';
import useHapticFeedback from '../../../hooks/useHapticFeedback';
import { checkReminderPermissions } from './useHabitReminders';
import { useCreateHabitHandlers } from './useCreateHabitHandlers';
import { showCreateError } from '../../../utils/errorAlerts';
import { useHabitData, useModalCleanup } from './useCreateHabitModalEffects';
import { EXIT_DURATIONS } from '../../Modal/Modal.constants';
import { createOptimisticHabitId } from '../../../features/habits/hooks/optimisticHabitCreationStore';
import type { Id } from '../../../../convex/_generated/dataModel';

export const useCreateHabitModal = (props: CreateHabitModalProps) => {
  const { visible, onClose, habitToEdit, onHabitCreated, onHabitCreateSynced } =
    props;
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
    why: form.why,
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
        const clientRequestId = createOptimisticHabitId();
        const tempId = clientRequestId as Id<'habits'>;
        // Raise the Home focus request before closing: the section holds the
        // form's exit until the list has converged behind it.
        onHabitCreated?.(tempId);
        cleanup();
        setTimeout(form.resetForm, EXIT_DURATIONS.fullScreen);
        // On failure the optimistic habit rolls back, so tell the user why
        // and offer a retry instead of letting it vanish silently.
        const runCreate = (isRetry = false) => {
          // An explicit retry renews a request that may have expired while
          // the error alert was open. Reuse the id for an idempotent save.
          if (isRetry) onHabitCreated?.(tempId);
          void createNewHabit({ ...data, clientRequestId })
            .then((habitId) => {
              if (habitId) onHabitCreateSynced?.(tempId, habitId);
            })
            .catch(() => showCreateError(() => runCreate(true)));
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
    onHabitCreated,
    onHabitCreateSynced,
  ]);

  return { form, handleCreate, isEditMode };
};
