/**
 * Type definitions for StreakTrendsChart component
 */

export interface StreakTrendData {
  date: string;
  averageStreak: number;
  maxStreak: number;
  minStreak: number;
}

export interface StreakTrendsChartProps {
  data: StreakTrendData[] | null;
  darkMode?: boolean;
}
