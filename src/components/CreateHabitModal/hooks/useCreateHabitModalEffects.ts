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
  customDays?: number[];
  dayPhase: string | null;
  frequency?: string;
  frequencyCount?: number;
  fullHabitName: string;
  reminderSound: string | null;
  reminderTime: Date;
  selectedColor: string;
  selectedEmoji: string | null;
}

export function useHabitData(params: HabitDataParams) {
  return useMemo(
    () => ({
      customDays: params.customDays,
      dayPhase: params.dayPhase,
      frequency: params.frequency,
      frequencyCount: params.frequencyCount,
      fullHabitName: params.fullHabitName,
      reminderSound: params.reminderSound,
      reminderTime: params.reminderTime,
      selectedColor: params.selectedColor,
      selectedEmoji: params.selectedEmoji,
    }),
    [
      params.customDays,
      params.dayPhase,
      params.frequency,
      params.frequencyCount,
      params.fullHabitName,
      params.reminderSound,
      params.reminderTime,
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
