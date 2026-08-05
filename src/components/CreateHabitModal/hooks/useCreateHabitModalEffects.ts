/**
 * useCreateHabitModalEffects - Side effects for modal visibility changes
 */

import { useEffect, useCallback, useMemo } from 'react';
import { EXIT_DURATIONS } from '../../Modal/Modal.constants';
import type { ProgressEmojiSet } from '../../../utils/progressEmojis';

interface UseModalEffectsParams {
  visible: boolean;
  isEditMode: boolean;
  resetForm: () => void;
}

/** Clears create form after the exit animation finishes, not when dismiss starts. */
export function useDeferredFormResetOnClose({
  visible,
  isEditMode,
  resetForm,
}: UseModalEffectsParams) {
  useEffect(() => {
    if (visible || isEditMode) return;

    const timeout = setTimeout(resetForm, EXIT_DURATIONS.fullScreen);
    return () => clearTimeout(timeout);
  }, [visible, isEditMode, resetForm]);
}

interface HabitDataParams {
  dayPhase: string | null;
  effortMinutes?: number;
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
      effortMinutes: params.effortMinutes,
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
      params.effortMinutes,
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
  closeColorPicker: () => void;
  setShowTimePicker: (show: boolean) => void;
  triggerSuccess: () => void;
  onClose: () => void;
}

export function useModalCleanup({
  closeColorPicker,
  setShowTimePicker,
  triggerSuccess,
  onClose,
}: CleanupParams) {
  return useCallback(() => {
    closeColorPicker();
    setShowTimePicker(false);
    triggerSuccess();
    onClose();
  }, [closeColorPicker, setShowTimePicker, triggerSuccess, onClose]);
}
