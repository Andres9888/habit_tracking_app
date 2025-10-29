import { useCallback, useMemo, useState } from 'react';
import { DEFAULT_COLOR, DEFAULT_EMOJI } from '../constants';
import type { HabitDoc } from '../types';
import { buildHabitName, parseHabitName, parseReminderTime } from '../utils';

const DEFAULT_SOUND = 'Default';

interface UseHabitFormOptions {
  habitToEdit?: HabitDoc | null;
}

export const useHabitForm = ({ habitToEdit }: UseHabitFormOptions) => {
  const parsed = useMemo(
    () => parseHabitName(habitToEdit?.name ?? `${DEFAULT_EMOJI} `),
    [habitToEdit?.name]
  );

  const [habitName, setHabitName] = useState(parsed.name);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(
    parsed.emoji ?? DEFAULT_EMOJI
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

  const fullHabitName = useMemo(
    () => buildHabitName(selectedEmoji, habitName),
    [selectedEmoji, habitName]
  );

  const resetForm = useCallback(() => {
    setHabitName('');
    setSelectedEmoji(DEFAULT_EMOJI);
    setSelectedColor(DEFAULT_COLOR);
    setRemindersEnabled(false);
    setReminderTime(parseReminderTime(undefined));
    setReminderSound(DEFAULT_SOUND);
  }, []);

  return {
    habitName,
    setHabitName,
    selectedEmoji,
    setSelectedEmoji,
    selectedColor,
    setSelectedColor,
    isColorPickerVisible,
    openColorPicker: () => setColorPickerVisible(true),
    closeColorPicker: () => setColorPickerVisible(false),
    remindersEnabled,
    setRemindersEnabled,
    reminderTime,
    setReminderTime,
    showTimePicker,
    setShowTimePicker,
    reminderSound,
    setReminderSound,
    fullHabitName,
    resetForm,
  };
};
