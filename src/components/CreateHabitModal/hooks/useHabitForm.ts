/**
 * useHabitForm - Main habit form state and validation hook
 *
 * @description
 * Manages all form state for habit creation/editing. Provides:
 * - Form field values (name, emoji, color, reminders)
 * - Validation (habit name with debounced feedback)
 * - Setters for updating form fields
 * - Computed values (fullHabitName = emoji + name)
 * - Form initialization from `habitToEdit`
 * - Form reset functionality
 *
 * @role Form State Manager
 * This hook is the single source of truth for all form data. It:
 * 1. Initializes state from `habitToEdit` (if editing)
 * 2. Provides validated setters for each field
 * 3. Computes derived values (e.g., fullHabitName)
 * 4. Exposes reset function to clear form
 *
 * @architecture
 * - State: `useHabitFormState` - Raw useState calls for each field
 * - Init: `useHabitFormInit` - Populate from habitToEdit on mount
 * - Reset: `useHabitFormReset` - Return all fields to defaults
 * - Validation: `useFieldValidation` - Debounced validation for habit name
 * - Sync: `useReminderOptionSync` - Keep reminder fields in sync
 *
 * @validation
 * Habit name is validated with debouncing (500ms):
 * - Min length: 1 character
 * - Max length: 100 characters
 * - Allowed chars: letters, numbers, punctuation, emojis
 * - Error shown after blur (not while typing)
 *
 * @see {@link useHabitFormState} - State management
 * @see {@link useFieldValidation} - Validation logic
 *
 * @module CreateHabitModal/hooks
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
    setSelectedEmoji: state.setSelectedEmoji,
    setShowTimePicker: state.setShowTimePicker,
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
    selectedEmoji: state.selectedEmoji,
    setDayPhase: state.setDayPhase,
    setFrequency: state.setFrequency,
    setHabitName: setHabitNameWithValidation,
    setReminderOption,
    setRemindersEnabled: state.setRemindersEnabled,
    setReminderSound: state.setReminderSound,
    setReminderTime: state.setReminderTime,
    setSelectedColor: state.setSelectedColor,
    setSelectedEmoji: state.setSelectedEmoji,
    setShowTimePicker: state.setShowTimePicker,
    showTimePicker: state.showTimePicker,
  };
};
