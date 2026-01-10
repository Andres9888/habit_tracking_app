/**
 * Types for ReminderSelector component
 */

/**
 * Reminder options for the V8 unified reminder selector
 */
export type ReminderOption = 'none' | 'morning' | 'midday' | 'evening';

export interface ReminderOptionInfo {
  id: ReminderOption;
  emoji: string;
  label: string;
  time: string | null;
  hour: number | null;
  minute: number | null;
}

export interface ReminderOptionButtonProps {
  option: ReminderOption;
  isSelected: boolean;
  onPress: () => void;
  reduceMotion: boolean;
}

export interface ReminderSelectorProps {
  selectedOption: ReminderOption;
  onSelectOption: (option: ReminderOption) => void;
}
