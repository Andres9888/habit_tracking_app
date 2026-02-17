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
  daysOfWeek?: number[];
  everyXDays?: number;
  frequency?: string;
  fullHabitName: string;
  reminderSound: string | null;
  reminderTime: Date;
  selectedColor: string;
  selectedEmoji: string | null;
  timesPerWeek?: number;
}

export function useHabitData(params: HabitDataParams) {
  return useMemo(
    () => ({
      dayPhase: params.dayPhase,
      daysOfWeek: params.daysOfWeek,
      everyXDays: params.everyXDays,
      frequency: params.frequency,
      fullHabitName: params.fullHabitName,
      reminderSound: params.reminderSound,
      reminderTime: params.reminderTime,
      selectedColor: params.selectedColor,
      selectedEmoji: params.selectedEmoji,
      timesPerWeek: params.timesPerWeek,
    }),
    [
      params.dayPhase,
      params.daysOfWeek,
      params.everyXDays,
      params.frequency,
      params.fullHabitName,
      params.reminderSound,
      params.reminderTime,
      params.selectedColor,
      params.selectedEmoji,
      params.timesPerWeek,
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
