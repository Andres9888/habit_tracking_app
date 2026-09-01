/**
 * useHabitForm - Main habit form hook
 */

/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
import { useCallback, useMemo } from 'react';
import type { HabitDoc } from '../types';
import { buildHabitName } from '../utils';
import type { ReminderOption } from '../components/ReminderSelector';
import { useReminderOptionSync } from './useReminderOptionSync';
import { useHabitFormState } from './useHabitFormState';
import { useHabitFormInit } from './useHabitFormInit';
import { useHabitFormReset } from './useHabitFormReset';
import { useFieldValidation } from '../../../utils/validation/useFieldValidation';
import { validateHabitName } from '../../../utils/validation';

interface UseHabitFormOptions {
  habitToEdit?: HabitDoc | null;
}

export const useHabitForm = ({ habitToEdit }: UseHabitFormOptions) => {
  const state = useHabitFormState({ habitToEdit });

  // Habit name validation
  const habitNameValidation = useFieldValidation({
    debounceMs: 500,
    initialValue: state.habitName,
    showErrorsAfterBlur: true,
    validate: validateHabitName,
  });

  // Sync validation state with form state
  const setHabitNameWithValidation = useCallback(
    (value: string) => {
      habitNameValidation.setValue(value);
      state.setHabitName(value);
    },
    [habitNameValidation.setValue, state.setHabitName]
  );

  const fullHabitName = useMemo(
    () => buildHabitName(state.selectedEmoji, habitNameValidation.value),
    [state.selectedEmoji, habitNameValidation.value]
  );

  const syncReminderOption = useReminderOptionSync({
    setDayPhase: state.setDayPhase,
    setRemindersEnabled: state.setRemindersEnabled,
    setReminderTime: state.setReminderTime,
  });

  const setReminderOption = useCallback(
    (option: ReminderOption) => {
      state.setReminderOptionState(option);
      syncReminderOption(option);
    },
    [state.setReminderOptionState, syncReminderOption]
  );

  useHabitFormInit({
    habitToEdit,
    parsed: state.parsed,
    setters: {
      setDayPhase: state.setDayPhase,
      setFrequency: state.setFrequency,
      setHabitName: state.setHabitName,
      setReminderOptionState: state.setReminderOptionState,
      setRemindersEnabled: state.setRemindersEnabled,
      setReminderSound: state.setReminderSound,
      setReminderTime: state.setReminderTime,
      setSelectedColor: state.setSelectedColor,
      setSelectedDays: state.setSelectedDays,
      setSelectedEmoji: state.setSelectedEmoji,
    },
  });

  const resetForm = useHabitFormReset({
    setColorPickerVisible: state.setColorPickerVisible,
    setDayPhase: state.setDayPhase,
    setFrequency: state.setFrequency,
    setHabitName: state.setHabitName,
    setReminderOptionState: state.setReminderOptionState,
    setRemindersEnabled: state.setRemindersEnabled,
    setReminderSound: state.setReminderSound,
    setReminderTime: state.setReminderTime,
    setSelectedColor: state.setSelectedColor,
    setSelectedDays: state.setSelectedDays,
    setSelectedEmoji: state.setSelectedEmoji,
    setShowTimePicker: state.setShowTimePicker,
    setWhy: state.setWhy,
  });

  const closeColorPicker = useCallback(
    () => state.setColorPickerVisible(false),
    [state.setColorPickerVisible]
  );

  const openColorPicker = useCallback(
    () => state.setColorPickerVisible(true),
    [state.setColorPickerVisible]
  );

  return {
    closeColorPicker,
    dayPhase: state.dayPhase,
    frequency: state.frequency,
    fullHabitName,
    habitName: habitNameValidation.value,
    habitNameError: habitNameValidation.error,
    habitNameIsValid: habitNameValidation.isValid,
    isColorPickerVisible: state.isColorPickerVisible,
    onHabitNameBlur: habitNameValidation.onBlur,
    openColorPicker,
    reminderOption: state.reminderOption,
    remindersEnabled: state.remindersEnabled,
    reminderSound: state.reminderSound,
    reminderTime: state.reminderTime,
    resetForm,
    selectedColor: state.selectedColor,
    selectedDays: state.selectedDays,
    selectedEmoji: state.selectedEmoji,
    setDayPhase: state.setDayPhase,
    setFrequency: state.setFrequency,
    setSelectedDays: state.setSelectedDays,
    setHabitName: setHabitNameWithValidation,
    setReminderOption,
    setRemindersEnabled: state.setRemindersEnabled,
    setReminderSound: state.setReminderSound,
    setReminderTime: state.setReminderTime,
    setSelectedColor: state.setSelectedColor,
    setSelectedEmoji: state.setSelectedEmoji,
    setShowTimePicker: state.setShowTimePicker,
    setStrengthAlgorithm: state.setStrengthAlgorithm,
    setProgressEmojis: state.setProgressEmojis,
    setStreakGoal: state.setStreakGoal,
    setWhy: state.setWhy,
    showTimePicker: state.showTimePicker,
    strengthAlgorithm: state.strengthAlgorithm,
    progressEmojis: state.progressEmojis,
    streakGoal: state.streakGoal,
    why: state.why,
  };
};
