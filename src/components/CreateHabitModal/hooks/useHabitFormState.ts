/**
 * useHabitFormState - State management for habit form
 */

import { useMemo, useState } from 'react';
import { DEFAULT_COLOR } from '../constants';
import type { HabitDoc } from '../types';
import type { ProgressEmojiSet } from '../../../utils/progressEmojis';
import { parseHabitName, parseReminderTime } from '../utils';
import {
  type HubermanPhase,
  getPhaseFromPreferredTime,
} from '../../../constants/hubermanPhases';
import type { ReminderOption } from '../components/ReminderSelector';
import { getReminderOptionFromTime } from './reminderUtils';

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
    habitToEdit?.color ?? habitToEdit?.iconColor ?? DEFAULT_COLOR
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
  const [frequency, setFrequency] = useState<string>(
    habitToEdit?.frequency ?? ''
  );
  const [selectedDays, setSelectedDays] = useState<number[]>(
    habitToEdit?.daysOfWeek ?? [0, 1, 2, 3, 4, 5, 6]
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
  const [strengthAlgorithm, setStrengthAlgorithm] = useState<
    'forgiving' | 'balanced' | 'strict'
  >(() => {
    const mode = habitToEdit?.strengthAlgorithm;
    return mode === 'forgiving' || mode === 'balanced' || mode === 'strict'
      ? mode
      : 'balanced';
  });
  const [progressEmojis, setProgressEmojis] = useState<
    ProgressEmojiSet | undefined
  >(habitToEdit?.progressEmojis as ProgressEmojiSet | undefined);
  const [streakGoal, setStreakGoal] = useState<number>(
    habitToEdit?.goalDuration ?? 0
  );

  return {
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
    selectedDays,
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
    setSelectedDays,
    setSelectedEmoji,
    setShowTimePicker,
    setStrengthAlgorithm,
    setProgressEmojis,
    setStreakGoal,
    showTimePicker,
    strengthAlgorithm,
    progressEmojis,
    streakGoal,
  };
}
