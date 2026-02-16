/**
 * useHabitFormReset - Reset habit form to default state
 *
 * @description
 * Provides a memoized function to reset all form fields to their defaults.
 * Used when modal closes or when switching from edit to create mode.
 *
 * @role Reset Handler
 * This hook creates a single `resetForm` function that:
 * 1. Clears all input fields
 * 2. Resets to default color/emoji/sound
 * 3. Disables reminders
 * 4. Closes modals (color picker, time picker)
 * 5. Uses smart default for reminder time
 *
 * @defaults
 * - habitName: "" (empty)
 * - selectedEmoji: null (no emoji)
 * - selectedColor: #10B981 (emerald)
 * - remindersEnabled: false
 * - reminderSound: "Default"
 * - reminderTime: Smart default (morning/midday/evening based on current time)
 *
 * @see {@link getSmartReminderDefault} - Time-aware default reminder
 * @see {@link useHabitForm} - Parent hook that uses this
 *
 * @module CreateHabitModal/hooks
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
};
