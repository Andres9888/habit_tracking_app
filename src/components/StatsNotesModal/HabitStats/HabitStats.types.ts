/**
 * Type definitions for HabitStats component
 */

import type { Id } from '../../../../convex/_generated/dataModel';

export interface CompletionDataItem {
  date: string;
  completed: boolean;
}

export interface HabitStatsData {
  completionData: CompletionDataItem[];
  currentStreak: number;
  longestStreak: number;
  weeklyData: CompletionDataItem[];
}

export interface HabitItem {
  _id: Id<'habits'>;
  name: string;
}

export interface ChartDataItem {
  date: string;
  completed: boolean;
}
