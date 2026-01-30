import { useCallback } from 'react';
import type { CreateHabitModalProps, HabitTemplate } from '../types';
import { useHabitForm } from './useHabitForm';
import { useScienceModal } from './useScienceModal';
import { useTemplateBrowser } from './useTemplateBrowser';
import useHapticFeedback from '../../../hooks/useHapticFeedback';
import { extractTemplateDetails } from '../utils';
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

  const applyTemplate = useCallback(
    (template: HabitTemplate) => {
      const { emoji, name } = extractTemplateDetails(template);
      form.setSelectedEmoji(emoji);
      form.setHabitName(name);
      if (template.iconColor) form.setSelectedColor(template.iconColor);
      if (template.frequency) form.setFrequency(template.frequency);
    },
    [
      form.setSelectedEmoji,
      form.setHabitName,
      form.setSelectedColor,
      form.setFrequency,
    ]
  );

  const template = useTemplateBrowser({
    isEditMode,
    onTemplateSelect: applyTemplate,
    visible,
  });
  const science = useScienceModal({ onSelectTemplate: applyTemplate });

  useVisibilityReset({
    isEditMode,
    resetForm: form.resetForm,
    science,
    template,
    visible,
  });

  const habitData = useHabitData({
    dayPhase: form.dayPhase,
    fullHabitName: form.fullHabitName,
    reminderSound: form.reminderSound,
    reminderTime: form.reminderTime,
    selectedColor: form.selectedColor,
    selectedEmoji: form.selectedEmoji,
  });

  const cleanup = useModalCleanup({
    closeColorPicker: form.closeColorPicker,
    onClose,
    resetForm: form.resetForm,
    science,
    setShowTimePicker: form.setShowTimePicker,
    template,
    triggerSuccess,
  });

  const handleCreate = useCallback(async () => {
    if (!form.habitName.trim() || !form.fullHabitName) return;
    const { hasReminders } = await checkReminderPermissions(
      form.remindersEnabled
    );
    const data = { ...habitData, hasReminders };

    await (isEditMode && habitToEdit
      ? handleEdit({ ...data, habitToEdit })
      : createNewHabit(data));
    cleanup();
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

  return { form, handleCreate, isEditMode, science, template };
};
