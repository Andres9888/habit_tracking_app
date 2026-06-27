/**
 * Habit Strength Section - TypeScript Type Definitions
 *
 * Types for the redesigned Habit Strength Section with time range switcher,
 * circular progress ring, full-width chart, and comparison stats.
 *
 * @see habit-strength-redesign-spec.md for design details
 */

import type { ProgressEmojiSet } from '@/utils/progressEmojis';

import type { StrengthLabel, StrengthSnapshot } from '../HabitStrengthHistory/types';
import type { StrengthJourney } from './journey';

/**
 * Time range options for filtering strength history.
 * - 1m: Last 30 days
 * - 3m: Last 90 days (quarterly view)
 * - 1y: Last 365 days
 */
export type TimeRange = '1m' | '3m' | '1y';

/**
 * Props for the main HabitStrengthSection component.
 */
export interface HabitStrengthSectionProps {
  /** Unique habit identifier */
  habitId: string;

  /** Set of completed dates in YYYY-MM-DD format */
  completedDates: Set<string>;

  /** Timestamp when the habit was created (ms since epoch) */
  habitCreatedAt: number;

  /** Optional habit color for theming */
  habitColor?: string;

  /**
   * Optional habit strength from database (0-1 decimal).
   * If provided, will be used instead of recalculating from completedDates.
   * This ensures consistency with HabitCard which uses habit.strength.
   */
  habitStrength?: number;

  /**
   * Resolved 5-level progress emoji set (per-habit override → user default →
   * built-in). Drives the ring, milestone track, and next-level copy so they
   * match whatever icon set the user picked.
   */
  progressEmojis: ProgressEmojiSet;
}

/**
 * Props for the TimeRangeToggle component.
 */
export interface TimeRangeToggleProps {
  /** Currently selected time range */
  value: TimeRange;

  /** Callback when time range changes */
  onChange: (value: TimeRange) => void;
}

/**
 * Props for the StrengthHero component.
 */
export interface StrengthHeroProps {
  /** Current strength percentage (0-100) */
  strength: number;

  /** Resolved journey with the user's chosen emojis and per-level colors */
  journey: StrengthJourney;
}

/**
 * Props for the StrengthChart component.
 */
export interface StrengthChartProps {
  /** Array of strength snapshots for the chart */
  data: StrengthSnapshot[];

  /** Selected time range (affects X-axis labels) */
  timeRange: TimeRange;

  /** Current strength value (for the pulsing dot) */
  currentStrength: number;

  /** Optional custom color override */
  color?: string;
}

/**
 * Props for the StrengthStatsRow component.
 */
export interface StrengthStatsRowProps {
  /** Change in the last month */
  lastMonth: number;

  /** Change in the last week */
  lastWeek: number;
}

/**
 * Extended metrics for the HabitStrengthSection.
 * Adds week-over-week delta and since-start metrics.
 */
export interface ExtendedStrengthMetrics {
  /** Current strength percentage (0-100) */
  current: number;

  /** Strength label based on thresholds */
  label: StrengthLabel;

  /** Change vs 30 days ago */
  deltaVsMonth: number;

  /** Change vs 7 days ago */
  deltaVsWeek: number;

  /** Change since habit creation (always equals current for new habits) */
  sinceStart: number;

  /** Filtered strength history for the selected time range */
  strengthHistory: StrengthSnapshot[];
}
