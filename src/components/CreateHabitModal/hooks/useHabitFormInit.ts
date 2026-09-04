/**
 * useHabitFormInit - Initialize habit form state from habitToEdit
 */

import { useEffect } from 'react';
import { pickUsableAccent } from '@/theme/iconTokens/usableAccent';
import { DEFAULT_COLOR } from '../constants';
import type { HabitDoc } from '../types';
import { parseReminderTime } from '../utils';
import {
  getPhaseFromPreferredTime,
  type HubermanPhase,
} from '../../../constants/hubermanPhases';
import { getReminderOptionFromTime } from './reminderUtils';
import type { ReminderOption } from '../components/ReminderSelector';

interface FormSetters {
  setHabitName: (name: string) => void;
  setSelectedEmoji: (emoji: string | null) => void;
  setSelectedColor: (color: string) => void;
  setRemindersEnabled: (enabled: boolean) => void;
  setReminderTime: (time: Date) => void;
  setReminderSound: (sound: string) => void;
  setFrequency: (freq: string) => void;
  setSelectedDays: (days: number[]) => void;
  setDayPhase: (phase: HubermanPhase | null) => void;
  setReminderOptionState: (option: ReminderOption) => void;
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
    setSelectedDays,
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
    setSelectedColor(
      pickUsableAccent(habitToEdit.color, habitToEdit.iconColor) ??
        DEFAULT_COLOR
    );
    setRemindersEnabled(habitToEdit.remindersEnabled ?? false);
    setReminderTime(parseReminderTime(habitToEdit.reminderTime));
    setReminderSound(habitToEdit.reminderSound ?? DEFAULT_SOUND);
    setFrequency(habitToEdit.frequency ?? '');
    setSelectedDays(habitToEdit.daysOfWeek ?? [0, 1, 2, 3, 4, 5, 6]);
    setDayPhase(getPhaseFromPreferredTime(habitToEdit.preferredTime));
    setReminderOptionState(
      getReminderOptionFromTime(
        habitToEdit.remindersEnabled,
        habitToEdit.reminderTime
      )
    );
  }, [habitToEdit?._id]);
};
