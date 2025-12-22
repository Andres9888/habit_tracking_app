/**
 * TypeScript Interfaces for CalendarHeatmap Component
 */

import type { Id } from '../../../convex/_generated/dataModel';

/**
 * Props for CalendarHeatmap container component
 */
export interface CalendarHeatmapProps {
  /** Habit ID for context */
  habitId: Id<'habits'>;

  /** Set of completed dates in YYYY-MM-DD format */
  completedDates: Set<string>;

  /** Date habit was created (to show tracking start) */
  habitCreatedAt?: number;

  /** Habit's accent color (hex) for theming cells */
  habitColor?: string;

  /** Callback when a day cell is tapped */
  onDayPress?: (date: string, completed: boolean) => void;
}

/**
 * Props for DayCell component
 */
export interface DayCellProps {
  /** Calendar day data */
  day: CalendarDay;

  /** Index for staggered animation */
  index: number;

  /** Custom habit color (hex) */
  habitColor?: string;

  /** Callback when cell is pressed */
  onPress?: (date: string, completed: boolean) => void;
}

/**
 * Props for InsightCard component
 */
export interface InsightCardProps {
  /** Day-of-week completion statistics */
  dayOfWeekStats: DayOfWeekStat[];

  /** Weakest performing day (if detected) */
  weakestDay: { day: string; rate: number } | null;

  /** Callback when user wants to set a reminder */
  onSetReminder?: (day: string) => void;

  /** Callback when user wants to see tips */
  onSeeTips?: (day: string) => void;

  /** Callback when user dismisses the card */
  onDismiss?: () => void;
}

/**
 * Represents a single day in the calendar grid
 */
export interface CalendarDay {
  /** Date string in YYYY-MM-DD format, null for padding cells */
  date: string | null;

  /** Day of month (1-31) */
  dayOfMonth: number | null;

  /** Whether the habit was completed on this day */
  completed: boolean;

  /** Whether this is today */
  isToday: boolean;

  /** Whether this is a future date */
  isFuture: boolean;

  /** Whether this date is before the habit was created */
  isBeforeCreation: boolean;
}

/**
 * Monthly statistics
 */
export interface MonthStats {
  /** Number of completions in the month */
  completions: number;

  /** Number of eligible days (excluding future days and pre-creation) */
  eligibleDays: number;

  /** Success rate as percentage (0-100) */
  successRate: number;
}

/**
 * Day-of-week completion statistics
 */
export interface DayOfWeekStat {
  /** Day name (e.g., "Sunday", "Monday") */
  day: string;

  /** Completion rate as percentage (0-100) */
  rate: number;

  /** Number of completions on this day */
  count: number;

  /** Total eligible occurrences of this day */
  total: number;
}
