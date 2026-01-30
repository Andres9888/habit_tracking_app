/**
 * Type definitions for StrengthComparisonCards
 */

export interface StrengthComparisonCardsProps {
  /** Current strength percentage (0-100) */
  current: number;
  /** Strength 30 days ago, or null if habit is younger than 30 days */
  thirtyDaysAgo: number | null;
  /** Strength 1 year ago, or null if habit is younger than 1 year */
  oneYearAgo: number | null;
  /** Change in strength vs 30 days ago */
  deltaVsMonth: number;
  /** Number of days since habit was created */
  habitAgeDays: number;
  /** Set of completed dates for calculating completion rate */
  completedDates?: Set<string>;
}

export interface StrengthCardProps {
  /** Strength percentage (0-100) */
  strength: number;
  /** Label to display below the percentage */
  timeLabel: string;
  /** Whether this is the highlighted "Now" card */
  isHighlighted?: boolean;
  /** Delta value to show (only for "Now" card) */
  delta?: number;
  /** Animation delay in ms */
  animationDelay?: number;
  /** Whether to show the "Perfect!" celebration badge */
  showPerfectBadge?: boolean;
}

export interface DeltaBadgeProps {
  delta: number;
}
