/**
 * useHabitFormInit - Initialize habit form state from habitToEdit
 */

import { useEffect } from 'react';
import { DEFAULT_COLOR } from '../constants';
import type { HabitDoc } from '../types';
import { parseReminderTime } from '../utils';
import { getPhaseFromPreferredTime } from '../../../constants/hubermanPhases';
import { getReminderOptionFromTime } from './reminderUtils';

interface FormSetters {
  setHabitName: (name: string) => void;
  setSelectedEmoji: (emoji: string | null) => void;
  setSelectedColor: (color: string) => void;
  setRemindersEnabled: (enabled: boolean) => void;
  setReminderTime: (time: Date) => void;
  setReminderSound: (sound: string) => void;
  setFrequency: (freq: string) => void;
  setDayPhase: (phase: string | null) => void;
  setReminderOptionState: (option: string) => void;
}

interface UseHabitFormInitOptions {
  habitToEdit: HabitDoc | null | undefined;
  parsed: { name: string; emoji: string | null };
  setters: FormSetters;
}

const DEFAULT_SOUND = 'Default';

export const useHabitFormInit = ({
  habitToEdit,
  parsed,
  setters,
}: UseHabitFormInitOptions) => {
  const {
    setDayPhase,
    setFrequency,
    setHabitName,
    setReminderOptionState,
    setRemindersEnabled,
    setReminderSound,
    setReminderTime,
    setSelectedColor,
    setSelectedEmoji,
  } = setters;

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
};
