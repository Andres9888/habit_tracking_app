/**
 * TodaysFocusCard Types
 *
 * Type definitions for the Today's Focus Card component.
 * This component provides contextual motivation at the top of Progress tab.
 *
 * @see docs/specs/habit-details-screen/progress-tab-improvements-spec.md
 */

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
 */
export type FocusState =
  | 'thriving'
  | 'building'
  | 'starting'
  | 'struggling'
  | 'recovering'
  | 'completed';

/**
 * Configuration for each focus state
 */
export interface FocusStateConfig {
  /** Gradient colors [start, end] */
  gradientColors: [string, string];
  /** Ionicons icon name */
  icon: string;
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
}

/**
 * Milestone thresholds for goal calculation
 */
export const MILESTONE_THRESHOLDS = [
  3, 7, 14, 21, 30, 60, 90, 100, 365,
] as const;

/**
 * Type for milestone values
 */
export type MilestoneValue = (typeof MILESTONE_THRESHOLDS)[number];
