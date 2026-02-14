/**
 * Streak data types
 */

export type FrequencyType = 'daily' | 'weekdays' | 'custom_days' | 'x_times_per_week';

export interface StreakData {
  currentStreak: number;
  bestStreak: number;
  lastCompletedDate: string;
}

export interface TrackingRecord {
  date: string;
  completed: boolean;
}
