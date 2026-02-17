/**
 * LeaderboardScreen Types
 */

import type { HabitId } from '../../features/habits/types';

export interface HabitStreakData {
  habitId: HabitId;
  habitName: string;
  currentStreak: number;
  longestStreak: number;
  strength: number;
}

export interface LeaderboardStats {
  topStreak: HabitStreakData | null;
  totalHabits: number;
  activeStreaks: number;
  longestEverStreak: number;
  averageStreak: number;
  topStreakers: HabitStreakData[]; // 30+ day streaks
  personalBests: {
    longestStreak: HabitStreakData | null;
    mostConsistent: HabitStreakData | null; // Highest strength
    currentBest: HabitStreakData | null; // Current longest active streak
  };
}
