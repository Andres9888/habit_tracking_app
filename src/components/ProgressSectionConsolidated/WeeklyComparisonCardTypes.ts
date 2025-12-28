/**
 * WeeklyComparisonCard Types
 *
 * Type definitions for the WeeklyComparisonCard component that displays
 * a comparison between this week's completions and last week's.
 *
 * The weekly comparison provides a quick visual indicator of momentum,
 * showing whether the user is maintaining, improving, or declining
 * in their habit consistency.
 *
 * @see docs/specs/habit-details-screen/progress/progress-section-tasks.md
 */

import type { HabitTrackingEntry } from '../../features/habits/types';

/**
 * Props for the WeeklyComparisonCard component
 */
export interface WeeklyComparisonCardProps {
  /** Habit tracking entries */
  tracking: HabitTrackingEntry[];
  /** Timestamp when habit was created (ISO string) */
  habitCreatedAt: string;
  /** Animation index for staggered entrance (default: 0) */
  index?: number;
}

/**
 * Weekly comparison data with completion counts
 */
export interface WeeklyComparisonData {
  /** This week's completion count (0-7) */
  thisWeekCompleted: number;
  /** This week's total trackable days (0-7, limited by habit creation) */
  thisWeekTotal: number;
  /** Last week's completion count (0-7) */
  lastWeekCompleted: number;
  /** Last week's total trackable days (0-7) */
  lastWeekTotal: number;
  /** Difference in completions (thisWeek - lastWeek) */
  difference: number;
  /** Percentage change from last week */
  percentChange: number;
  /** Trend direction */
  trend: 'up' | 'down' | 'stable';
  /** Daily data for this week (for bars visualization) */
  thisWeekDays: WeekDayData[];
  /** Daily data for last week (for bars visualization) */
  lastWeekDays: WeekDayData[];
}

/**
 * Single day's completion data for bar visualization
 */
export interface WeekDayData {
  /** Date string (YYYY-MM-DD) */
  date: string;
  /** Day abbreviation (Mon, Tue, etc.) */
  dayLabel: string;
  /** Whether the day was completed */
  completed: boolean;
  /** Whether the day is in the future (not yet trackable) */
  isFuture: boolean;
  /** Whether the day was before habit creation */
  isBeforeCreation: boolean;
}

/**
 * Comparison status for visual feedback
 */
export interface ComparisonStatus {
  /** Status level */
  level: 'improved' | 'maintained' | 'declined' | 'new';
  /** Display label */
  label: string;
  /** Emoji icon */
  emoji: string;
  /** Primary color (hex) */
  color: string;
  /** Light background color (hex) */
  bgColor: string;
  /** Description text */
  description: string;
}

/**
 * Comparison status definitions
 */
export const COMPARISON_STATUSES: ComparisonStatus[] = [
  {
    // emerald-600
    bgColor: '#ecfdf5',

    color: '#059669',

    // emerald-50
    description: 'More completions than last week',

    emoji: '🚀',

    label: 'Improving',
    level: 'improved',
  },
  {
    // cyan-600
    bgColor: '#ecfeff',

    color: '#0891b2',

    // cyan-50
    description: 'Matching last week',

    emoji: '✨',

    label: 'On Track',
    level: 'maintained',
  },
  {
    // amber-500
    bgColor: '#fffbeb',

    color: '#f59e0b',

    // amber-50
    description: 'Fewer completions than last week',

    emoji: '💪',

    label: 'Needs Focus',
    level: 'declined',
  },
  {
    // violet-500
    bgColor: '#f5f3ff',

    color: '#8b5cf6',

    // violet-50
    description: 'Building your first weeks',

    emoji: '🌱',

    label: 'Just Started',
    level: 'new',
  },
];

/**
 * Card styling constants
 */
export const WEEKLY_CARD_STYLES = {
  /** Bar gap in pixels */
  barGap: 4,

  /** Max bar height in pixels */
  barMaxHeight: 40,

  /** Bar width in pixels */
  barWidth: 8,
  /** Days in a week */
  daysInWeek: 7,
} as const;

/**
 * Animation timing constants
 */
export const WEEKLY_CARD_ANIMATION = {
  /** Bar reveal duration per bar (ms) */
  barRevealDuration: 100,

  /** Counter animation duration (ms) */
  counterDuration: 600,

  /** Entrance animation duration (ms) */
  entranceDuration: 300,

  /** Stagger delay between cards (ms) */
  staggerDelay: 75,
} as const;

/**
 * Helper function to get comparison status from difference
 */
export function getComparisonStatus(
  difference: number,
  lastWeekTotal: number
): ComparisonStatus {
  // New habit with no last week data
  if (lastWeekTotal === 0) {
    return COMPARISON_STATUSES.find((s) => s.level === 'new')!;
  }

  if (difference > 0) {
    return COMPARISON_STATUSES.find((s) => s.level === 'improved')!;
  } else if (difference < 0) {
    return COMPARISON_STATUSES.find((s) => s.level === 'declined')!;
  } else {
    return COMPARISON_STATUSES.find((s) => s.level === 'maintained')!;
  }
}
