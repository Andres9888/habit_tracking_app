/**
 * useHabitFormInit - Initialize habit form state from habitToEdit
 */

import { useEffect } from 'react';
import { DEFAULT_COLOR } from '../constants';
import type { HabitDoc } from '../types';
import type { FrequencyType } from '../components/FrequencyPicker';
import { parseReminderTime } from '../utils';
import { getPhaseFromPreferredTime, type HubermanPhase } from '../../../constants/hubermanPhases';
import { getReminderOptionFromTime } from './reminderUtils';
import type { ReminderOption } from '../components/ReminderSelector';

interface FormSetters {
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
  } = setters;

  // Initialize form only when habitToEdit changes (edit mode)
  // Setters from useState are stable and don't need to be in deps

  useEffect(() => {
    if (!habitToEdit) return;
    setHabitName(parsed.name);
    setSelectedEmoji(parsed.emoji);
    setSelectedColor(habitToEdit.iconColor ?? DEFAULT_COLOR);
    setRemindersEnabled(habitToEdit.remindersEnabled ?? false);
    setReminderTime(parseReminderTime(habitToEdit.reminderTime));
    setReminderSound(habitToEdit.reminderSound ?? DEFAULT_SOUND);
    setFrequency((habitToEdit.frequency as FrequencyType) ?? 'daily');
    setFrequencyCount(habitToEdit.frequencyCount ?? 3);
    setCustomDays(habitToEdit.daysOfWeek ?? [1, 2, 3, 4, 5]);
    setDayPhase(getPhaseFromPreferredTime(habitToEdit.preferredTime));
    setReminderOptionState(
      getReminderOptionFromTime(
        habitToEdit.remindersEnabled,
        habitToEdit.reminderTime
      )
    );
  }, [habitToEdit?._id]);
};
