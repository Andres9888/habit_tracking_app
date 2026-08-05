/**
 * Type definitions for ComplianceHeatmap component
 */

export interface HeatmapData {
  date: string;
  completionRate: number;
  level: 'none' | 'low' | 'medium' | 'high';
  completedHabits: number;
  totalHabits: number;
}

export interface ComplianceHeatmapProps {
  data: HeatmapData[] | null;
  onDayPress?: (day: HeatmapData) => void;
}

export interface MonthLabel {
  month: string;
  weekIndex: number;
}
