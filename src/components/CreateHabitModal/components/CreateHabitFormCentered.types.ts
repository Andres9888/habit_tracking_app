/**
 * Types for CreateHabitFormCentered
 */

import type { RefObject } from 'react';
import type { View } from 'react-native';
import type { ProgressEmojiSet } from '../../../utils/progressEmojis';

export interface CreateHabitFormCenteredProps {
  habitName: string;
  onHabitNameChange: (value: string) => void;
  selectedEmoji: string | null;
  onEmojiSelect: (emoji: string | null) => void;
  colors: readonly string[];
  selectedColor: string;
  onColorSelect: (color: string) => void;
  reminderEnabled: boolean;
  /** Ref for scrolling the daily reminder block into view */
  reminderSectionRef?: RefObject<View | null>;
  /** Reminder time as Date object for EnhancedReminderSelector */
  reminderTime: Date;
  onReminderToggle: (enabled: boolean) => void;
  /** Called when reminder time changes (preset or custom selection) */
  onReminderTimeChange: (time: Date) => void;
  onSubmit: () => void;
  autoFocus?: boolean;
  /** Whether to show validation error for empty habit name */
  showNameError?: boolean;
  /** Per-habit strength algorithm mode */
  strengthAlgorithm: 'forgiving' | 'balanced' | 'strict';
  onStrengthAlgorithmChange: (mode: 'forgiving' | 'balanced' | 'strict') => void;
  /** Per-habit growth icons override (undefined = inherit default) */
  progressEmojis: ProgressEmojiSet | undefined;
  onProgressEmojisChange: (next: ProgressEmojiSet | undefined) => void;
  /** Streak goal in days (0 = no goal) */
  streakGoal: number;
  onStreakGoalChange: (days: number) => void;
  /** Called after the Advanced section expands so the parent can scroll it into view. */
  onAdvancedExpand?: () => void;
}
