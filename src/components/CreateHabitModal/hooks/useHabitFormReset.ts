/**
 * useHabitFormReset - Reset habit form to default state
 */

import { useCallback } from 'react';
import type { HubermanPhase } from '../../../constants/hubermanPhases';
import type { ReminderOption } from '../components/ReminderSelector';
import type { FrequencyType } from '../components/FrequencyPicker';
import { DEFAULT_COLOR } from '../constants';
import { parseReminderTime } from '../utils';
import { getSmartReminderDefault } from '../../../utils/reminderDefaults';

const DEFAULT_SOUND = 'Default';

interface ResetFormSetters {
  setColorPickerVisible: (visible: boolean) => void;
  setCustomDays: (days: number[]) => void;
  setDayPhase: (phase: HubermanPhase | null) => void;
  setFrequency: (freq: FrequencyType) => void;
  setFrequencyCount: (count: number) => void;
  setHabitName: (name: string) => void;
  setReminderOptionState: (option: ReminderOption) => void;
  setRemindersEnabled: (enabled: boolean) => void;
  setReminderSound: (sound: string) => void;
  setReminderTime: (time: Date) => void;
  setSelectedColor: (color: string) => void;
  setSelectedEmoji: (emoji: string | null) => void;
  setShowTimePicker: (show: boolean) => void;
}

export const useHabitFormReset = (setters: ResetFormSetters) => {
  const {
    setColorPickerVisible,
    setCustomDays,
    setDayPhase,
    setFrequency,
    setFrequencyCount,
    setHabitName,
    setRemindersEnabled,
    setReminderOptionState,
    setReminderSound,
    setReminderTime,
    setSelectedColor,
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
    setFrequency('daily');
    setFrequencyCount(3);
    setCustomDays([1, 2, 3, 4, 5]); // Default to weekdays
    setDayPhase(null);
    setReminderOptionState(smartDefault);
  }, [
    setColorPickerVisible,
    setCustomDays,
    setDayPhase,
    setFrequency,
    setFrequencyCount,
    setHabitName,
    setRemindersEnabled,
    setReminderOptionState,
    setReminderSound,
    setReminderTime,
    setSelectedColor,
    setSelectedEmoji,
    setShowTimePicker,
  ]);
};
