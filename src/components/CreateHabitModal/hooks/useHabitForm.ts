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

  const fullHabitName = useMemo(
    () => buildHabitName(state.selectedEmoji, state.habitName),
    [state.selectedEmoji, state.habitName]
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
    habitName: state.habitName,
    isColorPickerVisible: state.isColorPickerVisible,
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
    setHabitName: state.setHabitName,
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
