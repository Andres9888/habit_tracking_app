/**
 * useHabitFormReset - Reset habit form to default state
 */

import { useCallback } from 'react';
import type { HubermanPhase } from '../../../constants/hubermanPhases';
import type { ReminderOption } from '../components/ReminderSelector';
import { DEFAULT_COLOR } from '../constants';
import { parseReminderTime } from '../utils';
import { getSmartReminderDefault } from '../../../utils/reminderDefaults';

const DEFAULT_SOUND = 'Default';

interface ResetFormSetters {
  setHabitName: (name: string) => void;
  setSelectedEmoji: (emoji: string | null) => void;
  setSelectedColor: (color: string) => void;
  setColorPickerVisible: (visible: boolean) => void;
  setRemindersEnabled: (enabled: boolean) => void;
  setReminderTime: (time: Date) => void;
  setShowTimePicker: (show: boolean) => void;
  setReminderSound: (sound: string) => void;
  setFrequency: (freq: string) => void;
  setSelectedDays: (days: number[]) => void;
  setDayPhase: (phase: HubermanPhase | null) => void;
  setReminderOptionState: (option: ReminderOption) => void;
}

export const useHabitFormReset = (setters: ResetFormSetters) => {
  const {
    setColorPickerVisible,
    setDayPhase,
    setFrequency,
    setHabitName,
    setRemindersEnabled,
    setReminderOptionState,
    setReminderSound,
    setReminderTime,
    setSelectedColor,
    setSelectedDays,
    setSelectedEmoji,
    setShowTimePicker,
  } = setters;

  return useCallback(() => {
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
    setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
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
    setSelectedDays,
    setSelectedEmoji,
    setShowTimePicker,
  ]);
};
