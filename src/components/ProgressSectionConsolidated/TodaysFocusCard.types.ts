/**
 * TodaysFocusCard Types
 *
 * Type definitions for the Today's Focus Card component.
 * This component provides contextual motivation at the top of Progress tab.
 *
 * @see docs/specs/habit-details-screen/progress-tab-improvements-spec.md
 */

import type { LucideIcon } from 'lucide-react-native';

/**
 * Focus states for the Today's Focus Card
 *
 * Each state represents a different user context with specific messaging
 * and visual treatment:
 *
 * - thriving: streak ≥ 7, weekly ≥ 5 (emerald→teal gradient)
 * - building: streak 3-6 (teal→cyan gradient)
 * - starting: habitAge < 7 (blue→indigo gradient)
 * - struggling: streak = 0, weekly < 3 (amber→orange gradient)
 * - recovering: streak = 0, bestStreak > 7 (violet→purple gradient)
 * - completed: isCompletedToday = true (green→emerald gradient)
 * - celebrating: Just hit a milestone (gold→amber gradient with confetti)
 */
export type FocusState =
  | 'thriving'
  | 'building'
  | 'starting'
  | 'struggling'
  | 'recovering'
  | 'completed'
  | 'celebrating';

/**
 * Configuration for each focus state
 */
export interface FocusStateConfig {
  /** Gradient colors [start, end] */
  gradientColors: [string, string];
  /** Lucide icon component */
  icon: LucideIcon;
  /** Icon color */
  iconColor: string;
  /** Primary text color */
  textColor: string;
  /** Secondary text color */
  subTextColor: string;
  /** Function to generate message based on goal/streak value */
  getMessage: (value: number) => string;
  /** Function to get goal label */
  getGoalLabel: () => string;
}

/**
 * Props for TodaysFocusCard component
 *
 * @example
 * ```tsx
 * <TodaysFocusCard
 *   currentStreak={14}
 *   isCompletedToday={false}
 *   weeklyCompletion={6}
 *   habitAge={30}
 *   bestStreak={21}
 *   celebratedMilestones={[7, 14]}
 *   onMilestoneCelebrated={(milestone) => console.log(`Celebrated ${milestone}`)}
 * />
 * ```
 */
export interface TodaysFocusCardProps {
  /** Current streak in days (0 if no active streak) */
  currentStreak: number;
  /** Whether the habit has been completed today */
  isCompletedToday: boolean;
  /** Number of days completed this week (0-7) */
  weeklyCompletion: number;
  /** Age of the habit in days since creation */
  habitAge: number;
  /** Best streak ever achieved in days */
  bestStreak: number;
  /** Array of milestones that have already been celebrated (to avoid re-celebrating) */
  celebratedMilestones?: number[];
  /** Callback when a milestone celebration is acknowledged */
  onMilestoneCelebrated?: (milestone: number) => void;
  /** Optional callback when share button is pressed during celebration */
  onShare?: () => void;
}

/**
 * Type for milestone values
 * Note: These values must match MILESTONE_THRESHOLDS in TodaysFocusCard.milestones.ts
 */
export type MilestoneValue = 3 | 7 | 14 | 21 | 30 | 60 | 90 | 100 | 365;

/**
 * Milestone configuration for celebrations
 */
export interface MilestoneCelebrationConfig {
  /** Number of days for this milestone */
  days: number;
  /** Badge emoji for this milestone */
  badge: string;
  /** Display name for this milestone */
  name: string;
  /** Celebration message */
  message: string;
  /** Subtext for encouragement */
  subtext: string;
}
