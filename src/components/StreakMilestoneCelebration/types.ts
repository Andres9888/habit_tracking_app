/**
 * Types for StreakMilestoneCelebration component
 */

import type { View } from 'react-native';
import type { StreakMilestone } from './constants';

export interface StreakMilestoneCelebrationProps {
  /** Modal visibility */
  visible: boolean;

  /** On close callback */
  onClose: () => void;

  /** The milestone achieved */
  milestone: StreakMilestone;

  /** Habit name for context */
  habitName: string;

  /** Current streak count */
  streakDays: number;

  /** Habit emoji icon */
  habitEmoji?: string;

  /** On share callback - opens share card generator */
  onShare?: () => void;
}

export interface AchievementCardProps {
  /** The milestone achieved */
  milestone: StreakMilestone;

  /** Habit name */
  habitName: string;

  /** Current streak days */
  streakDays: number;

  /** Habit emoji */
  habitEmoji?: string;

  /** View ref for screenshot capture */
  viewRef?: React.RefObject<View>;
}

export interface ConfettiAnimationProps {
  /** Whether confetti should be active */
  active: boolean;

  /** Callback when confetti animation completes */
  onComplete?: () => void;
}

export interface UseStreakMilestoneCheckOptions {
  /** Current streak count */
  currentStreak: number;

  /** Previous streak count (before latest completion) */
  previousStreak: number;

  /** Habit ID for tracking shown milestones */
  habitId: string;
}

export interface UseStreakMilestoneCheckReturn {
  /** The milestone to celebrate, if any */
  milestone: StreakMilestone | null;

  /** Whether the celebration modal should be visible */
  showCelebration: boolean;

  /** Dismiss the celebration */
  dismissCelebration: () => void;

  /** Mark milestone as shown (persisted) */
  markMilestoneShown: () => void;
}
