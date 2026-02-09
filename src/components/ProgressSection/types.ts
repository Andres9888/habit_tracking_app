/**
 * ProgressSection Types
 *
 * Shared type definitions for the consolidated progress components.
 */

import type { HabitTrackingEntry } from '../../features/habits/types';

/** Re-export as Tracking for compatibility */
export type Tracking = HabitTrackingEntry;

/**
 * Statistics for a specific day of the week
 */
export interface DayStats {
  /** Full day name (e.g., "Monday") */
  day: string;
  /** Day index (0 = Sunday, 6 = Saturday) */
  dayIndex: number;
  /** Number of completed days */
  completed: number;
  /** Total number of tracked days */
  total: number;
  /** Completion rate as percentage (0-100) */
  rate: number;
}

/**
 * A streak record entry
 */
export interface StreakRecord {
  /** Number of consecutive days */
  days: number;
  /** Start date of the streak (ISO string) */
  startDate: string;
  /** End date of the streak (ISO string) */
  endDate: string;
  /** Whether this is the current active streak */
  isCurrent: boolean;
}

/**
 * Level configuration for habit strength display
 */
export interface LevelConfig {
  /** Primary color for the level */
  color: string;
  /** Light background color for badges */
  colorLight: string;
  /** Description text for the level */
  description: string;
  /** Emoji representing the level */
  emoji: string;
  /** Display label for the level */
  label: string;
  /** Upper threshold for this level (exclusive) */
  maxThreshold: number;
  /** Lower threshold for this level (inclusive) */
  minThreshold: number;
}

/**
 * Monthly trend comparison data
 */
export interface TrendComparison {
  /** This month's completion rate (0-100) */
  thisMonth: number;
  /** Last month's completion rate (0-100) */
  lastMonth: number;
  /** Change between months (can be negative) */
  change: number;
}

/**
 * Props for the main ProgressSection container
 */
export interface ProgressSectionProps {
  /** Habit tracking entries */
  tracking: HabitTrackingEntry[];
  /** Timestamp when habit was created */
  habitCreatedAt?: number;
  /** Current habit strength value (0-100) */
  strength: number;
  /** Weekly change in strength */
  weeklyChange?: number;
  /** Callback when info button is pressed */
  onInfoPress?: () => void;
  /** Callback when worst day card is pressed */
  onWorstDayPress?: () => void;
  /** Callback when "See All" is pressed */
  onSeeAllPress?: () => void;
}

/**
 * Props for YourProgressCard component
 */
export interface YourProgressCardProps {
  /** Current strength value (0-100) */
  strength: number;
  /** Weekly change in strength (positive = improving, negative = declining) */
  weeklyChange?: number;
  /** Dynamic actionable tip based on user patterns */
  actionableTip: string;
  /** Callback when info button is pressed */
  onInfoPress?: () => void;
}

/**
 * Props for PersonalBestsCard component
 */
export interface PersonalBestsCardProps {
  /** Top streak records (up to 5) */
  streakRecords: StreakRecord[];
  /** Current active streak (0 if none) */
  currentStreak: number;
  /** Best performing day of the week */
  bestDay: DayStats | null;
  /** Worst performing day of the week */
  worstDay: DayStats | null;
  /** Callback when worst day card is pressed for tips */
  onWorstDayPress?: () => void;
}

/**
 * Props for ThisMonthCard component
 */
export interface ThisMonthCardProps {
  /** Statistics for each day of the week */
  dayStats: DayStats[];
  /** This month's completion rate (0-100) */
  thisMonthRate: number;
  /** Last month's completion rate (0-100) */
  lastMonthRate: number;
  /** Number of completed days this month */
  completedDays: number;
  /** Total days so far this month */
  totalDays: number;
  /** Callback when "See All" button is pressed */
  onSeeAllPress?: () => void;
}
