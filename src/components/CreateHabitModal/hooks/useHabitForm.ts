import { useCallback, useEffect, useMemo, useState } from 'react';
import { DEFAULT_COLOR } from '../constants';
import type { HabitDoc } from '../types';
import { buildHabitName, parseHabitName, parseReminderTime } from '../utils';
import {
  type HubermanPhase,
  getPhaseFromPreferredTime,
} from '../../../constants/hubermanPhases';

const DEFAULT_SOUND = 'Default';

interface UseHabitFormOptions {
  habitToEdit?: HabitDoc | null;
}

export const useHabitForm = ({ habitToEdit }: UseHabitFormOptions) => {
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
  const [frequency, setFrequency] = useState<string>(
    habitToEdit?.frequency ?? ''
  );
  const [dayPhase, setDayPhase] = useState<HubermanPhase | null>(
    getPhaseFromPreferredTime(habitToEdit?.preferredTime)
  );

  const fullHabitName = useMemo(
    () => buildHabitName(selectedEmoji, habitName),
    [selectedEmoji, habitName]
  );

  useEffect(() => {
    if (!habitToEdit) {
      return;
    }

    setHabitName(parsed.name);
    setSelectedEmoji(parsed.emoji);
    setSelectedColor(habitToEdit.iconColor ?? DEFAULT_COLOR);
    setRemindersEnabled(habitToEdit.remindersEnabled ?? false);
    setReminderTime(parseReminderTime(habitToEdit.reminderTime));
    setReminderSound(habitToEdit.reminderSound ?? DEFAULT_SOUND);
    setFrequency(habitToEdit.frequency ?? '');
    setDayPhase(getPhaseFromPreferredTime(habitToEdit.preferredTime));
  }, [habitToEdit, parsed]);

  const resetForm = useCallback(() => {
    setHabitName('');
    setSelectedEmoji(null);
    setSelectedColor(DEFAULT_COLOR);
    setColorPickerVisible(false);
    setRemindersEnabled(false);
    setReminderTime(parseReminderTime(undefined));
    setShowTimePicker(false);
    setReminderSound(DEFAULT_SOUND);
    setFrequency('');
    setDayPhase(null);
  }, []);

  return {
    dayPhase,
    frequency,
    fullHabitName,
    habitName,
    isColorPickerVisible,
    openColorPicker: () => setColorPickerVisible(true),
    closeColorPicker: () => setColorPickerVisible(false),
    reminderSound,
    reminderTime,
    remindersEnabled,
    resetForm,
    selectedColor,
    selectedEmoji,
    setDayPhase,
    setFrequency,
    setHabitName,
    setReminderSound,
    setReminderTime,
    setRemindersEnabled,
    setSelectedColor,
    setSelectedEmoji,
    setShowTimePicker,
    showTimePicker,
  };
};
