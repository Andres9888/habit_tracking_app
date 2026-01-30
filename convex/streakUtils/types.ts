/**
 * Streak data types
 */

export interface StreakData {
  currentStreak: number;
  bestStreak: number;
  lastCompletedDate: string;
}

export interface TrackingRecord {
  date: string;
  completed: boolean;
}
