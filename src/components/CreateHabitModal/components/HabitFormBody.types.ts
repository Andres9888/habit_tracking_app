/**
 * Types for HabitFormBody — the form body shared by Add and Edit.
 */

import type { RefObject } from 'react';
import type { View as ViewType } from 'react-native';
import type { ProgressEmojiSet } from '../../../utils/progressEmojis';
import type { GrowthType } from '@/utils/growthTypeMeta';

export interface HabitFormBodyProps {
  habitName: string;
  onHabitNameChange: (value: string) => void;
  /** Heading above the name input — mode-driven (create vs edit) */
  title?: string;
  /** Name input placeholder — mode-driven */
  placeholder?: string;
  /** Growth type pill shown in the Advanced section (edit mode) */
  growthType?: GrowthType;
  /**
   * True on create flows: an untouched default curve follows the detected
   * habit-type suggestion. False on edit flows (and template previews with an
   * explicit template default): the incoming value is respected.
   */
  isNewHabit: boolean;
  /** Called when the name input loses focus */
  onHabitNameBlur?: () => void;
  /**
   * Initial emoji-lock state. Locked = name-driven emoji suggestions stop
   * refreshing. Defaults to `selectedEmoji !== null` (create: locks once a
   * habit is pre-filled). Edit passes `false` so suggestions refresh while the
   * user retypes the name, then lock on the first manual pick.
   */
  initialEmojiLocked?: boolean;
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
  /**
   * Create-flow only: snap the seeded fallback reminder time to the nearest
   * preset on first enable. Edit must omit this — its incoming time is a
   * real saved value, and the safe default is false.
   */
  snapReminderDefaultToPreset?: boolean;
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
  /** Ref attached to the daily reminder container so the parent can measure and scroll to it. */
  reminderSectionRef?: RefObject<ViewType | null>;
}
