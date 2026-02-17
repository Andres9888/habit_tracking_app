/**
 * StreakHeatmap Types
 *
 * GitHub-style contribution graph for habit streak visualization.
 */

export interface StreakHeatmapProps {
  /** Set of completed date strings in YYYY-MM-DD format */
  completedDates: Set<string>;
  /** Habit accent color (hex) for intensity scaling */
  habitColor?: string;
  /** Number of weeks to display (default: 16) */
  weeks?: number;
  /** Whether to show the animated chain link overlay */
  showChainLinks?: boolean;
  /** Current streak count for chain animation */
  currentStreak?: number;
  /** Whether to reduce motion for accessibility */
  reduceMotion?: boolean;
}

export interface DayCellData {
  date: string;
  completed: boolean;
  intensity: number; // 0-4 scale like GitHub
  isToday: boolean;
  isFuture: boolean;
}

export type IntensityLevel = 0 | 1 | 2 | 3 | 4;
