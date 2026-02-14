/**
 * Types for CreateHabitFormCentered
 */

import type { FrequencyType } from './FrequencyPicker';

export interface CreateHabitFormCenteredProps {
  customDays?: number[];
  frequency?: FrequencyType;
  frequencyCount?: number;
  habitName: string;
  onCustomDaysChange?: (days: number[]) => void;
  onFrequencyChange?: (frequency: FrequencyType, count?: number, days?: number[]) => void;
  onFrequencyCountChange?: (count: number) => void;
  onHabitNameChange: (value: string) => void;
  selectedEmoji: string | null;
  onEmojiSelect: (emoji: string | null) => void;
  colors: readonly string[];
  selectedColor: string;
  onColorSelect: (color: string) => void;
  reminderEnabled: boolean;
  /** Reminder time as Date object for EnhancedReminderSelector */
  reminderTime: Date;
  onReminderToggle: (enabled: boolean) => void;
  /** Called when reminder time changes (preset or custom selection) */
  onReminderTimeChange: (time: Date) => void;
  onSubmit: () => void;
  autoFocus?: boolean;
  /** Whether to show validation error for empty habit name */
  showNameError?: boolean;
}
