import { useCallback, useEffect, useMemo, useState } from 'react';
import { DEFAULT_COLOR } from '../constants';
import type { HabitDoc } from '../types';
import { buildHabitName, parseHabitName, parseReminderTime } from '../utils';
import {
  type HubermanPhase,
  getPhaseFromPreferredTime,
} from '../../../constants/hubermanPhases';
import type { ReminderOption } from '../components/ReminderSelector';
import { getSmartReminderDefault } from '../../../utils/reminderDefaults';
import { getReminderOptionFromTime } from './reminderUtils';
import { useReminderOptionSync } from './useReminderOptionSync';

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
  const [reminderOption, setReminderOptionState] = useState<ReminderOption>(
    getReminderOptionFromTime(
      habitToEdit?.remindersEnabled,
      habitToEdit?.reminderTime
    )
  );

  const fullHabitName = useMemo(
    () => buildHabitName(selectedEmoji, habitName),
    [selectedEmoji, habitName]
  );

  const syncReminderOption = useReminderOptionSync({
    setDayPhase,
    setRemindersEnabled,
    setReminderTime,
  });

  const setReminderOption = useCallback(
    (option: ReminderOption) => {
      setReminderOptionState(option);
      syncReminderOption(option);
    },
    [syncReminderOption]
  );

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
  }, [habitToEdit, parsed]);

  const resetForm = useCallback(() => {
    const smartDefault = getSmartReminderDefault();
    setHabitName('');
    setSelectedEmoji(null);
    setSelectedColor(DEFAULT_COLOR);
    setColorPickerVisible(false);
    setRemindersEnabled(false);
    setReminderTime(parseReminderTime());
    setShowTimePicker(false);
    setReminderSound(DEFAULT_SOUND);
    setFrequency('');
    setDayPhase(null);
    setReminderOptionState(smartDefault);
  }, []);

  return {
    closeColorPicker: () => setColorPickerVisible(false),
    dayPhase,
    frequency,
    fullHabitName,
    habitName,
    isColorPickerVisible,
    openColorPicker: () => setColorPickerVisible(true),
    reminderOption,
    remindersEnabled,
    reminderSound,
    reminderTime,
    resetForm,
    selectedColor,
    selectedEmoji,
    setDayPhase,
    setFrequency,
    setHabitName,
    setReminderOption,
    setRemindersEnabled,
    setReminderSound,
    setReminderTime,
    setSelectedColor,
    setSelectedEmoji,
    setShowTimePicker,
    showTimePicker,
  };
};
