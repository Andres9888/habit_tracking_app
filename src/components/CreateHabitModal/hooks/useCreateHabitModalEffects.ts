/**
 * useCreateHabitModalEffects - Side effects for modal visibility changes
 */

import { useEffect, useCallback, useMemo } from 'react';
import type { UseTemplateBrowser } from './useTemplateBrowser';
import type { UseScienceModal } from './useScienceModal';

interface UseModalEffectsParams {
  visible: boolean;
  isEditMode: boolean;
  resetForm: () => void;
  template: UseTemplateBrowser;
  science: UseScienceModal;
}

export function useVisibilityReset({
  visible,
  isEditMode,
  resetForm,
  template,
  science,
}: UseModalEffectsParams) {
  useEffect(() => {
    if (!visible || isEditMode) return;
    resetForm();
    template.reset();
    template.closeTemplateBrowser();
    science.close();
  }, [
    visible,
    isEditMode,
    resetForm,
    template.reset,
    template.closeTemplateBrowser,
    science.close,
  ]);
}

interface HabitDataParams {
  dayPhase: string | null;
  fullHabitName: string;
  reminderSound: string | null;
  reminderTime: Date;
  selectedCategory: string | null;
  selectedColor: string;
  selectedEmoji: string | null;
}

export function useHabitData(params: HabitDataParams) {
  return useMemo(
    () => ({
      dayPhase: params.dayPhase,
      fullHabitName: params.fullHabitName,
      reminderSound: params.reminderSound,
      reminderTime: params.reminderTime,
      selectedCategory: params.selectedCategory,
      selectedColor: params.selectedColor,
      selectedEmoji: params.selectedEmoji,
    }),
    [
      params.dayPhase,
      params.fullHabitName,
      params.reminderSound,
      params.reminderTime,
      params.selectedCategory,
      params.selectedColor,
      params.selectedEmoji,
    ]
  );
}

interface CleanupParams {
  resetForm: () => void;
  closeColorPicker: () => void;
  setShowTimePicker: (show: boolean) => void;
  template: UseTemplateBrowser;
  science: UseScienceModal;
  triggerSuccess: () => void;
  onClose: () => void;
}

export function useModalCleanup({
  resetForm,
  closeColorPicker,
  setShowTimePicker,
  template,
  science,
  triggerSuccess,
  onClose,
}: CleanupParams) {
  return useCallback(() => {
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
    template.reset,
    template.closeTemplateBrowser,
    science.close,
    triggerSuccess,
    onClose,
  ]);
}
