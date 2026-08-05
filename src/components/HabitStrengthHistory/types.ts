/**
 * Habit Strength History - TypeScript Type Definitions
 *
 * Types for the Habit Strength History feature that visualizes
 * how a habit's strength has evolved over time using exponential smoothing.
 *
 * @see habit-strength-history-spec.md for algorithm details
 */

/**
 * Strength label based on percentage thresholds:
 * - weak: 0-29% (habit not yet established)
 * - developing: 30-69% (building consistency)
 * - strong: 70-100% (habit is automatic)
 */
export type StrengthLabel = 'weak' | 'developing' | 'strong';

/**
 * A single point in the habit strength timeline.
 * Used for charting the strength evolution over time.
 */
export interface StrengthSnapshot {
  /** The date of this strength reading */
  date: Date;

  /** ISO date string in YYYY-MM-DD format for quick lookups */
  dateString: string;

  /** Strength percentage (0-100) */
  strength: number;

  /** Human-readable strength label based on thresholds */
  label: StrengthLabel;
}

/**
 * Aggregated metrics calculated from the strength history.
 * Provides comparison values and extremes for the insights UI.
 */
export interface StrengthMetrics {
  /** Current strength percentage (0-100) */
  current: number;

  /** Strength 30 days ago, or null if habit is younger than 30 days */
  thirtyDaysAgo: number | null;

  /** Strength 1 year ago, or null if habit is younger than 1 year */
  oneYearAgo: number | null;

  /** Highest recorded strength value */
  peak: number;

  /** Date when peak strength was achieved */
  peakDate: Date;

  /** Lowest recorded strength value (excluding day 1) */
  lowest: number;

  /** Date when lowest strength occurred */
  lowestDate: Date;

  /** Change in strength vs 30 days ago (positive = improvement) */
  deltaVsMonth: number;

  /** Number of days since habit was created */
  habitAgeDays: number;
}

/**
 * Color tokens for strength visualization.
 * Used for progress rings, badges, and chart gradients.
 */
export interface StrengthColors {
  /** Main color for text and primary elements */
  primary: string;

  /** Light background color for cards/containers */
  background: string;

  /** Medium color for rings and borders */
  ring: string;
}

/**
 * Configuration constants for the strength algorithm.
 * Based on Loop Habit Tracker's exponential smoothing approach.
 */
export interface StrengthAlgorithmConfig {
  /** Growth rate per completion (default: 0.05 = ~5%) */
  growthRate: number;

  /** Decay rate per missed day (default: 0.95 = ~5% loss) */
  decayRate: number;

  /** Maximum data points to sample for chart (default: 100) */
  maxSamplePoints: number;
}

/**
 * Return type for the useHabitStrength hook.
 */
export interface UseHabitStrengthReturn {
  /** Current habit strength (0-100) */
  currentStrength: number;

  /** Array of strength snapshots for charting */
  strengthHistory: StrengthSnapshot[];

  /** Aggregated metrics for comparison cards and insights */
  metrics: StrengthMetrics;

  /** Whether the calculation is still in progress */
  isCalculating: boolean;
}

/**
 * Props for the main HabitStrengthHistory component.
 */
export interface HabitStrengthHistoryProps {
  /** Unique habit identifier */
  habitId: string;

  /** Set of completed dates in YYYY-MM-DD format */
  completedDates: Set<string>;

  /** Timestamp when the habit was created (ms since epoch) */
  habitCreatedAt: number;

  /** Optional habit color for theming the chart */
  habitColor?: string;
}
