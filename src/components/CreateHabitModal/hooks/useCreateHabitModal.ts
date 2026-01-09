import { useCallback, useEffect, useMemo } from 'react';
import type { CreateHabitModalProps, HabitTemplate } from '../types';
import { useHabitForm } from './useHabitForm';
import { useScienceModal } from './useScienceModal';
import { useTemplateBrowser } from './useTemplateBrowser';
import useHapticFeedback from '../../../hooks/useHapticFeedback';
import { extractTemplateDetails } from '../utils';
import { checkReminderPermissions } from './useHabitReminders';
import { useCreateHabitHandlers } from './useCreateHabitHandlers';

export const useCreateHabitModal = (props: CreateHabitModalProps) => {
  const { visible, onClose, habitToEdit } = props;
  const isEditMode = !!habitToEdit;
  const form = useHabitForm({ habitToEdit });
  const { triggerSuccess } = useHapticFeedback();
  const { handleEdit, handleCreate: createNewHabit } = useCreateHabitHandlers();
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

  const applyTemplate = useCallback(
    (template: HabitTemplate) => {
      const { emoji, name } = extractTemplateDetails(template);
      setSelectedEmoji(emoji);
      setHabitName(name);
      if (template.iconColor) setSelectedColor(template.iconColor);
      if (template.frequency) setFrequency(template.frequency);
    },
    [setHabitName, setSelectedColor, setSelectedEmoji, setFrequency]
  );

  const template = useTemplateBrowser({
    isEditMode,
    onTemplateSelect: applyTemplate,
    visible,
  });
  const science = useScienceModal({ onSelectTemplate: applyTemplate });

  useEffect(() => {
    if (!visible || isEditMode) return;
    resetForm();
    template.reset();
    template.closeTemplateBrowser();
    science.close();
  }, [visible, isEditMode, resetForm, template, science]);

  const habitData = useMemo(
    () => ({
      dayPhase,
      fullHabitName: fullHabitName,
      reminderSound,
      reminderTime,
      selectedColor,
      selectedEmoji,
    }),
    [
      dayPhase,
      fullHabitName,
      reminderSound,
      reminderTime,
      selectedColor,
      selectedEmoji,
    ]
  );

  const cleanup = useCallback(() => {
    resetForm();
    closeColorPicker();
    setShowTimePicker(false);
    template.reset();
    template.closeTemplateBrowser();
    science.close();
    triggerSuccess();
    onClose();
  }, [
    resetForm,
    closeColorPicker,
    setShowTimePicker,
    template,
    science,
    triggerSuccess,
    onClose,
  ]);

  const handleCreate = useCallback(async () => {
    if (!habitName.trim() || !fullHabitName) return;
    const { hasReminders } = await checkReminderPermissions(remindersEnabled);
    const data = { ...habitData, hasReminders };

    await (isEditMode && habitToEdit
      ? handleEdit({ ...data, habitToEdit })
      : createNewHabit(data));
    cleanup();
  }, [
    habitName,
    fullHabitName,
    remindersEnabled,
    isEditMode,
    habitToEdit,
    habitData,
    handleEdit,
    createNewHabit,
    cleanup,
  ]);

  return { form, handleCreate, isEditMode, science, template };
};
