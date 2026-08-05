/**
 * Analytics types
 *
 * Type definitions for analytics queries and responses.
 */

import { Id } from '../_generated/dataModel';

/**
 * Habit with calculated strength and streak information
 */
export interface HabitWithStrength {
  _id: Id<'habits'>;
  _creationTime: number;
  name: string;
  icon?: string;
  archived?: boolean;
  paused?: boolean;
  strength: number;
  currentStreak: number;
  longestStreak: number;
}

/**
 * Ranked habit for the rankings list
 */
export interface RankedHabit {
  id: Id<'habits'>;
  name: string;
  emoji: string;
  strength: number;
  currentStreak: number;
  longestStreak: number;
  isAtRisk: boolean;
}

/**
 * Distribution level for strength categorization
 */
export interface DistributionLevel {
  count: number;
  percentage: number;
  emoji: string;
}

/**
 * Heatmap completion level
 */
export type CompletionLevel = 'none' | 'low' | 'medium' | 'high';

/**
 * Heatmap data point for a single day
 */
export interface HeatmapDataPoint {
  date: string;
  completionRate: number;
  level: CompletionLevel;
  completedHabits: number;
  totalHabits: number;
}

/**
 * Habit change data for weekly insights
 */
export interface HabitChange {
  habitId: Id<'habits'>;
  name: string;
  emoji: string;
  thisWeek: number;
  lastWeek: number;
  change: number;
  percentageChange: number;
  currentStreak: number;
}
