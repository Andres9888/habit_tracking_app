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
import { buildHabitFormReturn } from './useHabitFormReturn';

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
    [state, syncReminderOption]
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

  return buildHabitFormReturn({
    fullHabitName,
    resetForm,
    setReminderOption,
    state,
  });
};
