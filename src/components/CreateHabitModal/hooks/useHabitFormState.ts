/**
 * useHabitFormState - State management for habit form
 */

import { useMemo, useState } from 'react';
import { DEFAULT_COLOR } from '../constants';
import type { HabitDoc } from '../types';
import { parseHabitName, parseReminderTime } from '../utils';
import {
  type HubermanPhase,
  getPhaseFromPreferredTime,
} from '../../../constants/hubermanPhases';
import type { ReminderOption } from '../components/ReminderSelector';
import { getReminderOptionFromTime } from './reminderUtils';
import type { FrequencyType } from '../components/FrequencyPicker';

const DEFAULT_SOUND = 'Default';

interface UseHabitFormStateOptions {
  habitToEdit?: HabitDoc | null;
}

export function useHabitFormState({ habitToEdit }: UseHabitFormStateOptions) {
  const parsed = useMemo(
    () => parseHabitName(habitToEdit?.name ?? ''),
    [habitToEdit?.name]
  );

  const [habitName, setHabitName] = useState(parsed.name);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(
    parsed.emoji
  );
  const [selectedColor, setSelectedColor] = useState(
    habitToEdit?.iconColor ?? DEFAULT_COLOR
  );
  const [isColorPickerVisible, setColorPickerVisible] = useState(false);
  const [remindersEnabled, setRemindersEnabled] = useState(
    habitToEdit?.remindersEnabled ?? false
  );
  const [reminderTime, setReminderTime] = useState(() =>
    parseReminderTime(habitToEdit?.reminderTime)
  );
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [reminderSound, setReminderSound] = useState(
    habitToEdit?.reminderSound ?? DEFAULT_SOUND
  );
  const [frequency, setFrequency] = useState<FrequencyType>(
    (habitToEdit?.frequency as FrequencyType) ?? 'daily'
  );
  const [frequencyCount, setFrequencyCount] = useState(
    habitToEdit?.frequencyCount ?? 3
  );
  const [customDays, setCustomDays] = useState<number[]>(
    habitToEdit?.daysOfWeek ?? [1, 2, 3, 4, 5] // Default to weekdays
  );
  const [dayPhase, setDayPhase] = useState<HubermanPhase | null>(
    getPhaseFromPreferredTime(habitToEdit?.preferredTime)
  );
  const [reminderOption, setReminderOptionState] = useState<ReminderOption>(
    getReminderOptionFromTime(
      habitToEdit?.remindersEnabled,
      habitToEdit?.reminderTime
    )
  );

  return {
    customDays,
    dayPhase,
    frequency,
    frequencyCount,
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
    setCustomDays,
    setDayPhase,
    setFrequency,
    setFrequencyCount,
    setHabitName,
    setReminderOptionState,
    setRemindersEnabled,
    setReminderSound,
    setReminderTime,
    setSelectedColor,
    setSelectedEmoji,
    setShowTimePicker,
    showTimePicker,
  };
}
