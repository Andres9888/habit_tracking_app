/**
 * Types for CreateHabitFormCentered
 */

export interface CreateHabitFormCenteredProps {
  habitName: string;
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
  /** Selected duration in minutes (for micro-habits) */
  selectedDuration: number | null;
  /** Called when duration changes */
  onDurationSelect: (duration: number | null) => void;
  onSubmit: () => void;
  autoFocus?: boolean;
  /** Whether to show validation error for empty habit name */
  showNameError?: boolean;
}
