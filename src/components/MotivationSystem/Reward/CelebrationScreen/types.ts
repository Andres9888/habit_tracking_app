/**
 * Public type definitions for CelebrationScreen component
 */

import type { EmojiType } from '../QuickReflection';

/**
 * Habit data for display in Celebration Screen
 */
export interface CelebrationHabitData {
  /** Habit ID for tracking */
  id: string;
  /** Habit name */
  name: string;
  /** Habit icon emoji */
  icon?: string;
  /** Current streak count (updated after completion) */
  currentStreak?: number;
  /** Best streak ever achieved */
  bestStreak?: number;
  /** Total completions count */
  totalCompletions?: number;
  /** Completion rate percentage (0-100) */
  completionRate?: number;
  /** Whether this is a streak milestone (e.g., 7, 14, 30, 100 days) */
  isStreakMilestone?: boolean;
  /** Milestone number if applicable */
  milestoneNumber?: number;
}

export interface CelebrationScreenProps {
  /** Modal visibility */
  visible: boolean;
  /** Close modal callback */
  onClose: () => void;
  /** Habit data to display */
  habit: CelebrationHabitData | null;
  /** Current reflection emoji (if already set) */
  selectedEmoji?: EmojiType;
  /** Current reflection note (if already set) */
  reflectionNote?: string;
  /** Called when emoji is selected */
  onEmojiSelect?: (emoji: EmojiType) => void;
  /** Called when note is changed */
  onNoteChange?: (note: string) => void;
  /** Called when reflection is submitted */
  onReflectionSubmit?: () => void;
  /** Called when user taps "Record Voice" */
  onRecordVoice?: () => void;
  /** Called when user taps "Write Letter" */
  onWriteLetter?: () => void;
  /** Called when user taps "Done" */
  onDone?: () => void;
  /** Whether to skip animations for accessibility */
  reduceMotion?: boolean;
}

export interface CelebrationScreenContentProps {
  habit: CelebrationHabitData;
  visible: boolean;
  reduceMotion: boolean;
}

// Re-export internal component types for convenience
export type {
  AnimatedContentProps,
  ConfettiParticleProps,
  CelebrationHeaderProps,
  StreakDisplayProps,
  StatCardProps,
  StatsRowProps,
  CapturePromptButtonProps,
  DoneButtonProps,
} from './components/types';
