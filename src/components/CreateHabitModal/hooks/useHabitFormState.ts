/**
 * useHabitFormState - State management for habit form
 */

import { useMemo, useState } from 'react';
import { DEFAULT_COLOR } from '../constants';
import type { ProgressEmojiSet } from '../../../utils/progressEmojis';
import { parseHabitName } from '../utils';
import {
  type HubermanPhase,
  getPhaseFromPreferredTime,
} from '../../../constants/hubermanPhases';
import { useHabitReminderState } from './useHabitReminderState';
import type { UseHabitFormStateOptions } from './useHabitFormState.types';

export function useHabitFormState({ habitToEdit }: UseHabitFormStateOptions) {
  const parsed = useMemo(
    () => parseHabitName(habitToEdit?.name ?? ''),
    [habitToEdit?.name]
  );

  const reminder = useHabitReminderState({ habitToEdit });

  const [habitName, setHabitName] = useState(parsed.name);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(
    parsed.emoji
  );
  const [selectedColor, setSelectedColor] = useState(
    habitToEdit?.color ?? habitToEdit?.iconColor ?? DEFAULT_COLOR
  );
  const [isColorPickerVisible, setColorPickerVisible] = useState(false);
  const [frequency, setFrequency] = useState<string>(
    habitToEdit?.frequency ?? ''
  );
  const [effortMinutes, setEffortMinutes] = useState<number | undefined>(
    habitToEdit?.effortMinutes
  );
  const [selectedDays, setSelectedDays] = useState<number[]>(
    habitToEdit?.daysOfWeek ?? [0, 1, 2, 3, 4, 5, 6]
  );
  const [dayPhase, setDayPhase] = useState<HubermanPhase | null>(
    getPhaseFromPreferredTime(habitToEdit?.preferredTime)
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
    ...reminder,
    dayPhase,
    effortMinutes,
    frequency,
    habitName,
    isColorPickerVisible,
    parsed,
    selectedColor,
    selectedDays,
    selectedEmoji,
    setColorPickerVisible,
    setDayPhase,
    setEffortMinutes,
    setFrequency,
    setHabitName,
    setSelectedColor,
    setSelectedDays,
    setSelectedEmoji,
    setStrengthAlgorithm,
    setProgressEmojis,
    setStreakGoal,
    strengthAlgorithm,
    progressEmojis,
    streakGoal,
  };
}
