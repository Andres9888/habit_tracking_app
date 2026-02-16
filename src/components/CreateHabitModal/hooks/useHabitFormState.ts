/**
 * useHabitFormState - State management for habit form
 *
 * @description
 * Manages all useState calls for the habit form fields.
 * Initializes state from `habitToEdit` when in edit mode.
 *
 * @role State Container
 * This hook is the raw state layer. It:
 * 1. Creates useState for each form field
 * 2. Initializes from habitToEdit (if provided)
 * 3. Returns state values + setters
 * 4. Provides parsed habit name (emoji + text)
 *
 * @fields
 * - habitName: Text portion of habit name (no emoji)
 * - selectedEmoji: Emoji icon (null if none)
 * - selectedColor: Hex color code for habit
 * - isColorPickerVisible: Color picker modal state
 * - remindersEnabled: Whether reminders are active
 * - reminderTime: Date object for scheduled reminder
 * - showTimePicker: Time picker modal state
 * - reminderSound: Sound name for notification
 * - frequency: Habit frequency string
 * - dayPhase: Huberman phase (morning/afternoon/evening)
 * - reminderOption: Quick reminder preset selection
 *
 * @see {@link useHabitForm} - Parent hook that uses this
 * @see {@link useHabitFormInit} - Initializes state from habitToEdit
 *
 * @module CreateHabitModal/hooks
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
    setSelectedEmoji,
    setShowTimePicker,
    showTimePicker,
  };
}
