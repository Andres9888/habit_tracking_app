/**
 * useHabitFormReturn - Build return object for useHabitForm
 */

import type { ReminderOption } from '../components/ReminderSelector';

interface HabitFormState {
  dayPhase: string;
  frequency: string;
  habitName: string;
  isColorPickerVisible: boolean;
  reminderOption: ReminderOption;
  remindersEnabled: boolean;
  reminderSound: string | null;
  reminderTime: Date;
  selectedColor: string;
  selectedEmoji: string | null;
  showTimePicker: boolean;
  setColorPickerVisible: (visible: boolean) => void;
  setDayPhase: (phase: string) => void;
  setFrequency: (freq: string) => void;
  setHabitName: (name: string) => void;
  setRemindersEnabled: (enabled: boolean) => void;
  setReminderSound: (sound: string | null) => void;
  setReminderTime: (time: Date) => void;
  setSelectedColor: (color: string) => void;
  setSelectedEmoji: (emoji: string | null) => void;
  setShowTimePicker: (show: boolean) => void;
}

interface BuildFormReturnParams {
  state: HabitFormState;
  fullHabitName: string;
  resetForm: () => void;
  setReminderOption: (option: ReminderOption) => void;
}

export function buildHabitFormReturn({
  state,
  fullHabitName,
  resetForm,
  setReminderOption,
}: BuildFormReturnParams) {
  return {
    closeColorPicker: () => state.setColorPickerVisible(false),
    dayPhase: state.dayPhase,
    frequency: state.frequency,
    fullHabitName,
    habitName: state.habitName,
    isColorPickerVisible: state.isColorPickerVisible,
    openColorPicker: () => state.setColorPickerVisible(true),
    reminderOption: state.reminderOption,
    remindersEnabled: state.remindersEnabled,
    reminderSound: state.reminderSound,
    reminderTime: state.reminderTime,
    resetForm,
    selectedColor: state.selectedColor,
    selectedEmoji: state.selectedEmoji,
    setDayPhase: state.setDayPhase,
    setFrequency: state.setFrequency,
    setHabitName: state.setHabitName,
    setReminderOption,
    setRemindersEnabled: state.setRemindersEnabled,
    setReminderSound: state.setReminderSound,
    setReminderTime: state.setReminderTime,
    setSelectedColor: state.setSelectedColor,
    setSelectedEmoji: state.setSelectedEmoji,
    setShowTimePicker: state.setShowTimePicker,
    showTimePicker: state.showTimePicker,
  };
}
