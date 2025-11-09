import { useCallback, useEffect, useMemo, useState } from 'react';
import { DEFAULT_COLOR } from '../constants';
import type { HabitDoc } from '../types';
import { buildHabitName, parseHabitName, parseReminderTime } from '../utils';

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
    (habitToEdit as any)?.frequency ?? ''
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
    setFrequency((habitToEdit as any)?.frequency ?? '');
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
    frequency,
    setFrequency,
  };
};
