/**
 * useCreateHabitModal - Main orchestration hook for habit creation flow
 *
 * @description
 * Central coordinator for the habit creation/editing modal. Manages:
 * - Form state via `useHabitForm`
 * - Template browsing and application
 * - Science modal integration
 * - Create/edit handlers and mutations
 * - Modal lifecycle (visibility, reset, cleanup)
 *
 * @role Main Orchestrator
 * This hook is the "brain" of CreateHabitModal. It:
 * 1. Initializes form state (edit mode vs create mode)
 * 2. Sets up template and science modal sub-features
 * 3. Provides `handleCreate` action that validates and saves
 * 4. Cleans up on close (reset form, haptics, dismiss)
 *
 * @flow Habit Creation
 * 1. Modal opens → `useVisibilityReset` resets form if not editing
 * 2. User fills form → `form` state updates from `useHabitForm`
 * 3. User taps save → `handleCreate` called
 * 4. Validation → Reminder permissions → API mutation → Cleanup
 *
 * @flow Template Application
 * User selects template → `applyTemplate` extracts data → Form populated
 *
 * @see {@link useHabitForm} - Form state management
 * @see {@link useCreateHabitHandlers} - Create/edit mutations
 * @see {@link useTemplateBrowser} - Template selection
 *
 * @module CreateHabitModal/hooks
 */

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

  return { form, handleCreate, isEditMode, science, template };
};
