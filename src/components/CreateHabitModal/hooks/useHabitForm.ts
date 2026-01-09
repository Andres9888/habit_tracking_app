/**
 * useHabitForm - Main habit form hook
 */

import { useCallback, useEffect, useMemo } from 'react';
import { DEFAULT_COLOR } from '../constants';
import type { HabitDoc } from '../types';
import { buildHabitName, parseReminderTime } from '../utils';
import { getPhaseFromPreferredTime } from '../../../constants/hubermanPhases';
import type { ReminderOption } from '../components/ReminderSelector';
import { getSmartReminderDefault } from '../../../utils/reminderDefaults';
import { getReminderOptionFromTime } from './reminderUtils';
import { useReminderOptionSync } from './useReminderOptionSync';
import { useHabitFormState } from './useHabitFormState';

const DEFAULT_SOUND = 'Default';

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

  useEffect(() => {
    if (!habitToEdit) return;
    setHabitName(parsed.name);
    setSelectedEmoji(parsed.emoji);
    setSelectedColor(habitToEdit.iconColor ?? DEFAULT_COLOR);
    setRemindersEnabled(habitToEdit.remindersEnabled ?? false);
    setReminderTime(parseReminderTime(habitToEdit.reminderTime));
    setReminderSound(habitToEdit.reminderSound ?? DEFAULT_SOUND);
    setFrequency(habitToEdit.frequency ?? '');
    setDayPhase(getPhaseFromPreferredTime(habitToEdit.preferredTime));
    setReminderOptionState(
      getReminderOptionFromTime(
        habitToEdit.remindersEnabled,
        habitToEdit.reminderTime
      )
    );
  }, [
    habitToEdit,
    parsed,
    setHabitName,
    setSelectedEmoji,
    setSelectedColor,
    setRemindersEnabled,
    setReminderTime,
    setReminderSound,
    setFrequency,
    setDayPhase,
    setReminderOptionState,
  ]);

  const resetForm = useCallback(() => {
    const smartDefault = getSmartReminderDefault();
    setHabitName('');
    setSelectedEmoji(null);
    setSelectedColor(DEFAULT_COLOR);
    setColorPickerVisible(false);
    setRemindersEnabled(false);
    setReminderTime(parseReminderTime());
    setShowTimePicker(false);
    setReminderSound(DEFAULT_SOUND);
    setFrequency('');
    setDayPhase(null);
    setReminderOptionState(smartDefault);
  }, [
    setColorPickerVisible,
    setDayPhase,
    setFrequency,
    setHabitName,
    setRemindersEnabled,
    setReminderOptionState,
    setReminderSound,
    setReminderTime,
    setSelectedColor,
    setSelectedEmoji,
    setShowTimePicker,
  ]);

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
