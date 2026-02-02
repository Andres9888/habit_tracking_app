/**
 * useHabitFormInit - Initialize habit form state from habitToEdit
 */

import { useEffect, type Dispatch, type SetStateAction } from 'react';
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
  setDayPhase: Dispatch<SetStateAction<HubermanPhase | null>>;
  setReminderOptionState: Dispatch<SetStateAction<ReminderOption>>;
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
    setFrequency(habitToEdit.frequency ?? '');
    setDayPhase(getPhaseFromPreferredTime(habitToEdit.preferredTime));
    setReminderOptionState(
      getReminderOptionFromTime(
        habitToEdit.remindersEnabled,
        habitToEdit.reminderTime
      )
    );
  }, [habitToEdit?._id]);
};
