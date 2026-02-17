/**
 * Types for CreateHabitFormCentered
 */

import type { Difficulty } from './DifficultySelector';

export interface CreateHabitFormCenteredProps {
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
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
  onSubmit: () => void;
  autoFocus?: boolean;
  /** Whether to show validation error for empty habit name */
  showNameError?: boolean;
}
