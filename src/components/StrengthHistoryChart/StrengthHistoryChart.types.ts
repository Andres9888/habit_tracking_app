export interface DataPoint {
  /** ISO date string */
  date: string;
  /** Strength value 0-100 */
  strength: number;
  /** Optional baseline value */
  baseline?: number;
  /** Optional compliance value */
  compliance?: number;
}

export interface StrengthHistoryChartProps {
  /** Historical strength data (up to 30 days) */
  data: DataPoint[];
  /** Show baseline and compliance as separate lines */
  showDualAxis?: boolean;
  /** Height of the chart */
  height?: number;
  /** Show data point values on tap */
  interactive?: boolean;
}

export interface ChartPoint {
  data: DataPoint;
  x: number;
  y: number;
}

export type TrendDirection = 'up' | 'down' | 'stable';
