/**
 * Type definitions for StreakIntervals component
 */

export interface StreakIntervalsData {
  averageStreak: number;
  longestStreak: number;
  currentStreak: number;
  totalStreaks: number;
  activeHabitsCount: number;
}

export interface StreakIntervalsProps {
  data: StreakIntervalsData | null;
  darkMode?: boolean;
}
