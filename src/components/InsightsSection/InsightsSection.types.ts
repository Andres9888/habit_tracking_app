/**
 * Type definitions for InsightsSection components
 */

import type { Id } from '../../../convex/_generated/dataModel';
import type { HabitTrackingEntry } from '../../features/habits/types';

/**
 * Props for the main InsightsSection component
 */
export interface InsightsSectionProps {
  habitId: Id<'habits'>;
  tracking: HabitTrackingEntry[];
  habitCreatedAt?: number;
  totalCompletions: number;
  successRate: number;
  daysTracking: number;
}

/**
 * Statistics for a single day of the week
 */
export interface DayStats {
  day: string;
  dayIndex: number;
  completed: number;
  total: number;
  rate: number;
}

/**
 * A streak record representing consecutive completions
 */
export interface StreakRecord {
  days: number;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

/**
 * Trend comparison between current and previous month
 */
export interface TrendComparison {
  thisMonth: number;
  lastMonth: number;
  change: number;
}

/**
 * Props for the DayBar component
 */
export interface DayBarProps {
  dayStats: DayStats;
  isBest: boolean;
  isWorst: boolean;
  maxRate: number;
  index: number;
}

/**
 * Props for the JourneyStatsSection component
 */
export interface JourneyStatsSectionProps {
  totalCompletions: number;
  successRate: number;
  daysTracking: number;
}

/**
 * Props for the BestDaysSection component
 */
export interface BestDaysSectionProps {
  dayStats: DayStats[];
  bestDay: DayStats | null;
  worstDay: DayStats | null;
  maxRate: number;
}

/**
 * Props for the StreakRecordsSection component
 */
export interface StreakRecordsSectionProps {
  streakRecords: StreakRecord[];
}

/**
 * Props for the TrendSection component
 */
export interface TrendSectionProps {
  trend: TrendComparison;
}

/**
 * Props for the EmptyInsightsState component
 */
export interface EmptyInsightsStateProps {
  daysRemaining: number;
}
