/**
 * useHabitReminderState - Reminder-related slice of the habit form state.
 *
 * Extracted from useHabitFormState to keep that module within the 100-line cap.
 */

import { useState } from 'react';
import { parseReminderTime } from '../utils';
import type { ReminderOption } from '../components/ReminderSelector';
import { getReminderOptionFromTime } from './reminderUtils';
import type { UseHabitFormStateOptions } from './useHabitFormState.types';

const DEFAULT_SOUND = 'Default';

export function useHabitReminderState({
  habitToEdit,
}: UseHabitFormStateOptions) {
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
  const [reminderOption, setReminderOptionState] = useState<ReminderOption>(
    getReminderOptionFromTime(
      habitToEdit?.remindersEnabled,
      habitToEdit?.reminderTime
    )
  );

  return {
    reminderOption,
    remindersEnabled,
    reminderSound,
    reminderTime,
    setReminderOptionState,
    setRemindersEnabled,
    setReminderSound,
    setReminderTime,
    setShowTimePicker,
    showTimePicker,
  };
}
