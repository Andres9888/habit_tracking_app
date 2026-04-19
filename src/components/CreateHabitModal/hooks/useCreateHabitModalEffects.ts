/**
 * useCreateHabitModalEffects - Side effects for modal visibility changes
 */

import { useEffect, useCallback, useMemo } from 'react';
import type { ProgressEmojiSet } from '../../../utils/progressEmojis';

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
  frequency: string;
  fullHabitName: string;
  reminderSound: string | null;
  reminderTime: Date;
  selectedColor: string;
  selectedDays: number[];
  selectedEmoji: string | null;
  strengthAlgorithm: 'forgiving' | 'balanced' | 'strict';
  progressEmojis: ProgressEmojiSet | undefined;
  streakGoal: number;
}

export function useHabitData(params: HabitDataParams) {
  return useMemo(
    () => ({
      dayPhase: params.dayPhase,
      frequency: params.frequency,
      fullHabitName: params.fullHabitName,
      reminderSound: params.reminderSound,
      reminderTime: params.reminderTime,
      selectedColor: params.selectedColor,
      selectedDays: params.selectedDays,
      selectedEmoji: params.selectedEmoji,
      strengthAlgorithm: params.strengthAlgorithm,
      progressEmojis: params.progressEmojis,
      streakGoal: params.streakGoal,
    }),
    [
      params.dayPhase,
      params.frequency,
      params.fullHabitName,
      params.reminderSound,
      params.reminderTime,
      params.selectedColor,
      params.selectedDays,
      params.selectedEmoji,
      params.strengthAlgorithm,
      params.progressEmojis,
      params.streakGoal,
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
