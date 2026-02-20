/**
 * useCreateHabitModalEffects - Side effects for modal visibility changes
 */

import { useEffect, useCallback, useMemo } from 'react';

interface UseModalEffectsParams {
  visible: boolean;
  isEditMode: boolean;
  resetForm: () => void;
}

export function useVisibilityReset({
  visible,
  isEditMode,
  resetForm,
}: UseModalEffectsParams) {
  useEffect(() => {
    if (!visible || isEditMode) return;
    resetForm();
  }, [visible, isEditMode, resetForm]);
}

interface HabitDataParams {
  dayPhase: string | null;
  fullHabitName: string;
  reminderSound: string | null;
  reminderTime: Date;
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
      selectedColor: params.selectedColor,
      selectedEmoji: params.selectedEmoji,
    }),
    [
      params.dayPhase,
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
  triggerSuccess: () => void;
  onClose: () => void;
}

export function useModalCleanup({
  resetForm,
  closeColorPicker,
  setShowTimePicker,
  triggerSuccess,
  onClose,
}: CleanupParams) {
  return useCallback(() => {
    resetForm();
    closeColorPicker();
    setShowTimePicker(false);
    triggerSuccess();
    onClose();
  }, [resetForm, closeColorPicker, setShowTimePicker, triggerSuccess, onClose]);
}
