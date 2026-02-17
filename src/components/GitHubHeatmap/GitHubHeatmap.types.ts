/**
 * Type definitions for GitHubHeatmap component
 */

export interface GitHubHeatmapData {
  date: string;
  completionRate: number;
  level: 'none' | 'low' | 'medium' | 'high';
  completedHabits: number;
  totalHabits: number;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  weekIndex: number; // 0-15 (for 16 weeks)
}

export interface GitHubHeatmapProps {
  data: GitHubHeatmapData[] | null;
  onDayPress?: (day: GitHubHeatmapData) => void;
  darkMode?: boolean;
}

export interface CellProps {
  data: GitHubHeatmapData;
  onPress?: () => void;
  darkMode?: boolean;
}

export interface LegendProps {
  darkMode?: boolean;
}
