/**
 * useHabitForm - Main habit form hook
 */

/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
import { useCallback, useMemo } from 'react';
import type { HabitDoc } from '../types';
import { buildHabitName } from '../utils';
import type { ReminderOption } from '../components/ReminderSelector';
import type { FrequencyValue } from '../../FrequencyPicker';
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

  const frequencyValue: FrequencyValue = useMemo(
    () => ({
      frequency: (state.frequency || 'daily') as FrequencyValue['frequency'],
      daysOfWeek: state.daysOfWeek,
      timesPerWeek: state.timesPerWeek,
      everyXDays: state.everyXDays,
    }),
    [state.frequency, state.daysOfWeek, state.timesPerWeek, state.everyXDays]
  );

  const setFrequencyValue = useCallback(
    (val: FrequencyValue) => {
      state.setFrequency(val.frequency);
      if (val.daysOfWeek !== undefined) state.setDaysOfWeek(val.daysOfWeek);
      if (val.timesPerWeek !== undefined) state.setTimesPerWeek(val.timesPerWeek);
      if (val.everyXDays !== undefined) state.setEveryXDays(val.everyXDays);
    },
    [state.setFrequency, state.setDaysOfWeek, state.setTimesPerWeek, state.setEveryXDays]
  );

  return {
    closeColorPicker,
    dayPhase: state.dayPhase,
    daysOfWeek: state.daysOfWeek,
    everyXDays: state.everyXDays,
    frequency: state.frequency,
    frequencyValue,
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
    setFrequencyValue,
    timesPerWeek: state.timesPerWeek,
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
