import { useCallback, useEffect, useMemo, useState } from 'react';
import { DEFAULT_COLOR } from '../constants';
import type { HabitDoc } from '../types';
import { buildHabitName, parseHabitName, parseReminderTime } from '../utils';
import {
  type HubermanPhase,
  getPhaseFromPreferredTime,
} from '../../../constants/hubermanPhases';
import {
  type ReminderOption,
  getReminderTimeForOption,
  REMINDER_OPTIONS,
} from '../components/ReminderSelector';
import { getSmartReminderDefault } from '../../../utils/reminderDefaults';

const DEFAULT_SOUND = 'Default';

/**
 * Derives the reminder option from habit's reminder time
 * Maps existing reminder times to V8 unified options
 */
const getReminderOptionFromTime = (
  remindersEnabled: boolean | undefined,
  reminderTime: string | undefined
): ReminderOption => {
  if (!remindersEnabled || !reminderTime) {
    return 'none';
  }

  // Parse the time string (e.g., "7:00 AM", "12:00 PM", "8:00 PM")
  const parsed = parseReminderTime(reminderTime);
  const hours = parsed.getHours();

  // Map to closest option based on hour
  if (hours >= 5 && hours < 10) return 'morning';
  if (hours >= 10 && hours < 16) return 'midday';
  if (hours >= 16 || hours < 5) return 'evening';

  return 'none';
};

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

  /**
   * Sets the reminder option and syncs related states
   * - Updates remindersEnabled based on option
   * - Sets reminderTime from the option's predefined time
   * - Maps to corresponding dayPhase for habit metadata
   */
  const setReminderOption = useCallback((option: ReminderOption) => {
    setReminderOptionState(option);

    if (option === 'none') {
      setRemindersEnabled(false);
      setDayPhase(null);
    } else {
      setRemindersEnabled(true);
      const time = getReminderTimeForOption(option);
      if (time) {
        setReminderTime(time);
      }

      // Map reminder option to Huberman phase for habit metadata
      const phaseMap: Record<Exclude<ReminderOption, 'none'>, HubermanPhase> = {
        evening: 'phase3_pull',
        midday: 'phase2_pivot',
        morning: 'phase1_push',
      };
      setDayPhase(phaseMap[option]);
    }
  }, []);

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
    setReminderOptionState(
      getReminderOptionFromTime(
        habitToEdit.remindersEnabled,
        habitToEdit.reminderTime
      )
    );
  }, [habitToEdit, parsed]);

  const resetForm = useCallback(() => {
    // V11: Use time-aware smart default for reminder selection
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
