/**
 * Types for TrendLineChart component
 */

export interface TrendData {
  date: string;
  averageStrength: number;
}

export interface TrendLineChartProps {
  data: TrendData[] | null;
  onDataPointPress?: (dataPoint: TrendData) => void;
}
