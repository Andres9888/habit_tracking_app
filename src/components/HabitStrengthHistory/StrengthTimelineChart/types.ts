/**
 * Type definitions for StrengthTimelineChart
 */

import type { StrengthSnapshot } from '../types';

export interface StrengthTimelineChartProps {
  /** Array of strength snapshots for the timeline */
  strengthHistory: StrengthSnapshot[];
  /** Optional habit color for the chart gradient (hex) */
  habitColor?: string;
  /** Optional chart height (default: 120) */
  height?: number;
}

export interface ChartDimensions {
  width: number;
  height: number;
  chartWidth: number;
  chartHeight: number;
  paddingLeft: number;
  paddingRight: number;
  paddingTop: number;
  paddingBottom: number;
}

export interface XAxisLabel {
  text: string;
  x: number;
}

export interface ChartPoint {
  x: number;
  y: number;
}

export interface ChartPaths {
  areaPath: string;
  linePath: string;
  lastPoint: ChartPoint | null;
}
