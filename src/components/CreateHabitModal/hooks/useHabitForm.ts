/**
 * useHabitForm - Main habit form hook
 */

import { useCallback, useMemo } from 'react';
import type { HabitDoc } from '../types';
import { buildHabitName } from '../utils';
import type { ReminderOption } from '../components/ReminderSelector';
import { useReminderOptionSync } from './useReminderOptionSync';
import { useHabitFormState } from './useHabitFormState';
import { useHabitFormInit } from './useHabitFormInit';
import { useHabitFormReset } from './useHabitFormReset';

interface UseHabitFormOptions {
  habitToEdit?: HabitDoc | null;
}

export const useHabitForm = ({ habitToEdit }: UseHabitFormOptions) => {
  const state = useHabitFormState({ habitToEdit });
  const {
    dayPhase,
    frequency,
    habitName,
    isColorPickerVisible,
    parsed,
    reminderOption,
    remindersEnabled,
    reminderSound,
    reminderTime,
    selectedColor,
    selectedEmoji,
    setColorPickerVisible,
    setDayPhase,
    setFrequency,
    setHabitName,
    setReminderOptionState,
    setRemindersEnabled,
    setReminderSound,
    setReminderTime,
    setSelectedColor,
    setSelectedEmoji,
    setShowTimePicker,
    showTimePicker,
  } = state;

  const fullHabitName = useMemo(
    () => buildHabitName(selectedEmoji, habitName),
    [selectedEmoji, habitName]
  );
  const syncReminderOption = useReminderOptionSync({
    setDayPhase,
    setRemindersEnabled,
    setReminderTime,
  });

  const setReminderOption = useCallback(
    (option: ReminderOption) => {
      setReminderOptionState(option);
      syncReminderOption(option);
    },
    [setReminderOptionState, syncReminderOption]
  );

  useHabitFormInit({
    habitToEdit,
    parsed,
    setters: {
      setDayPhase,
      setFrequency,
      setHabitName,
      setReminderOptionState,
      setRemindersEnabled,
      setReminderSound,
      setReminderTime,
      setSelectedColor,
      setSelectedEmoji,
    },
  });

  const resetForm = useHabitFormReset({
    setColorPickerVisible,
    setDayPhase,
    setFrequency,
    setHabitName,
    setReminderOptionState,
    setRemindersEnabled,
    setReminderSound,
    setReminderTime,
    setSelectedColor,
    setSelectedEmoji,
    setShowTimePicker,
  });

  return {
    closeColorPicker: () => setColorPickerVisible(false),
    dayPhase,
    frequency,
    fullHabitName,
    habitName,
    isColorPickerVisible,
    openColorPicker: () => setColorPickerVisible(true),
    reminderOption,
    remindersEnabled,
    reminderSound,
    reminderTime,
    resetForm,
    selectedColor,
    selectedEmoji,
    setDayPhase,
    setFrequency,
    setHabitName,
    setReminderOption,
    setRemindersEnabled,
    setReminderSound,
    setReminderTime,
    setSelectedColor,
    setSelectedEmoji,
    setShowTimePicker,
    showTimePicker,
  };
};
