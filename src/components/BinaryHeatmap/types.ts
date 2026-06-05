/**
 * TypeScript Interfaces for BinaryHeatmap Component
 *
 * This component implements a GitHub-style binary (on/off) heatmap
 * for visualizing daily habit completion data.
 */

import type { Id } from '../../../convex/_generated/dataModel';

/**
 * Time range options for the heatmap display
 * - '3m': 3 months (~13 weeks)
 * - '6m': 6 months (~26 weeks)
 * - '1y': 1 year (~52 weeks)
 */
export type TimeRange = '3m' | '6m' | '1y';

/**
 * Cell state for visual styling
 * - 'done': Habit was completed (habit color)
 * - 'missed': Habit was not completed (gray)
 * - 'today': Current day (ring outline)
 * - 'future': Future date (faded)
 * - 'beforeCreation': Before habit was created (disabled)
 */
export type BinaryCellState =
  | 'done'
  | 'missed'
  | 'today'
  | 'future'
  | 'beforeCreation';

/**
 * Represents a single day in the binary heatmap grid
 */
export interface BinaryDay {
  /** Date string in YYYY-MM-DD format */
  date: string;

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
 * Month label for positioning above the grid
 */
export interface BinaryMonthLabel {
  /** Index of the week column where this month starts */
  weekIndex: number;

  /** Short month name (e.g., "Oct", "Nov") */
  label: string;
}

/**
 * Result of grid generation
 */
export interface BinaryGridData {
  /** Array of weeks, each week is array of 7 days (Sun-Sat) */
  weeks: (BinaryDay | null)[][];

  /** Month labels with their starting week indices */
  monthLabels: BinaryMonthLabel[];

  /** Statistics for the displayed period */
  stats: BinaryGridStats;
}

/**
 * Statistics for the displayed grid period
 */
export interface BinaryGridStats {
  /** Number of completions in the period */
  completions: number;

  /** Number of eligible days (excluding future and pre-creation) */
  eligibleDays: number;

  /** Completion rate as percentage (0-100) */
  completionRate: number;
}

/**
 * Props for the main BinaryHeatmap container component
 */
export interface BinaryHeatmapProps {
  /** Habit ID for context */
  habitId: Id<'habits'>;

  /** Set of completed dates in YYYY-MM-DD format */
  completedDates: Set<string>;

  /** Date habit was created (Unix timestamp) */
  habitCreatedAt?: number;

  /** Habit's accent color (hex) for theming cells */
  habitColor: string;

  /** Current streak count */
  currentStreak: number;

  /** Callback when a day cell is tapped */
  onDayPress?: (date: string, completed: boolean) => void;

  /** Time range to display (defaults to '6m') */
  timeRange?: TimeRange;

  /** Optional header title (defaults to 'Activity') */
  title?: string;

  /** Whether to show the completion rate in the legend (defaults to true) */
  showCompletionRate?: boolean;

  /** Compact banner mode: tighter padding, hides the Missed/Done legend */
  compact?: boolean;

  /** Optional callback for time range changes (legacy test compatibility) */
  onTimeRangeChange?: (range: TimeRange) => void;
}

/**
 * Props for BinaryHeatmapGrid component
 */
export interface BinaryHeatmapGridProps {
  /** Grid data containing weeks and month labels */
  gridData: BinaryGridData;

  /** Habit color for completed cells */
  habitColor: string;

  /** Callback when a cell is pressed */
  onCellPress?: (date: string, completed: boolean) => void;
}

/**
 * Props for BinaryCell component
 */
export interface BinaryCellProps {
  /** Day data (null for empty padding cells) */
  day: BinaryDay | null;

  /** Index for staggered animation */
  index: number;

  /** Habit color for completed state */
  habitColor: string;

  /** Callback when cell is pressed */
  onPress?: (date: string, completed: boolean) => void;
}

/**
 * Props for TimeRangeToggle component
 */
export interface TimeRangeToggleProps {
  /** Currently selected time range */
  value: TimeRange;

  /** Callback when time range changes */
  onChange: (range: TimeRange) => void;
}

/**
 * Props for HeatmapLegend component
 */
export interface HeatmapLegendProps {
  /** Habit color for "Done" indicator */
  habitColor: string;

  /** Completion rate as percentage (0-100) */
  completionRate: number;

  /** Whether to show the completion rate text (defaults to true) */
  showCompletionRate?: boolean;
}

/**
 * Props for HeatmapTooltip component
 */
export interface HeatmapTooltipProps {
  /** Day data to display */
  day: BinaryDay;

  /** Position coordinates */
  position: { x: number; y: number };

  /** Whether tooltip is visible */
  visible: boolean;

  /** Callback to close tooltip */
  onClose: () => void;
}

/**
 * Props for StatsRow component
 */
export interface StatsRowProps {
  /** Habit frequency label (e.g., "Daily", "Weekly") */
  frequency: string;

  /** Current streak count */
  currentStreak: number;

  /** Habit's accent color (hex) for theming streak badge */
  habitColor: string;

  /** Callback when settings button is pressed */
  onSettingsPress?: () => void;
}
