/**
 * ConsistencyIndexCard Types
 *
 * Type definitions for the ConsistencyIndexCard component that displays
 * a rolling 30-day consistency score with sparkline visualization.
 *
 * The consistency index measures how regularly a habit is performed,
 * rewarding streaks and penalizing gaps to provide a more nuanced
 * view of habit health than simple completion rate.
 *
 * @see docs/specs/habit-details-screen/progress/progress-section-tasks.md
 */

import type { HabitTrackingEntry } from '../../features/habits/types';

/**
 * Props for the ConsistencyIndexCard component
 */
export interface ConsistencyIndexCardProps {
  /** Habit tracking entries */
  tracking: HabitTrackingEntry[];
  /** Timestamp when habit was created (ISO string) */
  habitCreatedAt: string;
  /** Animation index for staggered entrance (default: 0) */
  index?: number;
}

/**
 * Consistency score data with sparkline values
 */
export interface ConsistencyData {
  /** Current 30-day consistency score (0-100) */
  score: number;
  /** Previous 30-day period score for comparison */
  previousScore: number;
  /** Change from previous period */
  change: number;
  /** Daily completion data for sparkline (last 30 days) */
  sparklineData: SparklinePoint[];
  /** Number of days included in calculation */
  daysIncluded: number;
}

/**
 * Single point in the sparkline visualization
 */
export interface SparklinePoint {
  /** Date string (YYYY-MM-DD) */
  date: string;
  /** Whether the day was completed */
  completed: boolean;
  /** Running consistency value for that day (0-100) */
  value: number;
}

/**
 * Consistency level thresholds for visual feedback
 */
export interface ConsistencyLevel {
  /** Minimum score for this level (inclusive) */
  min: number;
  /** Maximum score for this level (exclusive) */
  max: number;
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
 * Consistency level definitions
 * These provide visual feedback based on the consistency score
 */
export const CONSISTENCY_LEVELS: ConsistencyLevel[] = [
  {
    min: 0,
    max: 30,
    label: 'Building',
    emoji: '🌱',
    color: '#dc2626', // red-600
    bgColor: '#fef2f2', // red-50
    description: 'Time to build momentum',
  },
  {
    min: 30,
    max: 50,
    label: 'Developing',
    emoji: '🌿',
    color: '#f59e0b', // amber-500
    bgColor: '#fffbeb', // amber-50
    description: 'Keep pushing forward',
  },
  {
    min: 50,
    max: 70,
    label: 'Consistent',
    emoji: '🌳',
    color: '#16a34a', // green-600
    bgColor: '#f0fdf4', // green-50
    description: 'Solid consistency',
  },
  {
    min: 70,
    max: 85,
    label: 'Strong',
    emoji: '💪',
    color: '#0891b2', // cyan-600
    bgColor: '#ecfeff', // cyan-50
    description: 'Excellent performance',
  },
  {
    min: 85,
    max: 101,
    label: 'Elite',
    emoji: '⚡',
    color: '#7c3aed', // violet-600
    bgColor: '#f5f3ff', // violet-50
    description: 'Outstanding dedication',
  },
];

/**
 * Card styling constants
 */
export const CONSISTENCY_CARD_STYLES = {
  /** Card background color */
  bgColor: '#f0fdf4', // green-50 (default, may change based on level)
  /** Sparkline height in pixels */
  sparklineHeight: 32,
  /** Sparkline bar width */
  sparklineBarWidth: 4,
  /** Gap between sparkline bars */
  sparklineGap: 2,
  /** Number of days in rolling window */
  rollingWindowDays: 30,
} as const;

/**
 * Animation timing constants
 */
export const CONSISTENCY_CARD_ANIMATION = {
  /** Entrance animation duration (ms) */
  entranceDuration: 300,
  /** Stagger delay between cards (ms) */
  staggerDelay: 75,
  /** Sparkline reveal duration (ms) */
  sparklineRevealDuration: 600,
  /** Score counter animation duration (ms) */
  scoreCounterDuration: 800,
} as const;

/**
 * Helper function to get consistency level from score
 */
export function getConsistencyLevel(score: number): ConsistencyLevel {
  const level = CONSISTENCY_LEVELS.find(
    (l) => score >= l.min && score < l.max
  );
  return level || CONSISTENCY_LEVELS[0];
}
