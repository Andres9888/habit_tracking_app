/**
 * ChartGrid Component
 *
 * Renders horizontal dashed grid lines for the chart background.
 */

import React from 'react';

import { G, Line } from 'react-native-svg';

import {
  CHART_PADDING_X,
  COLORS,
  GRID_LINE_DASH,
  GRID_LINE_OPACITY,
} from '../constants';

import type { ChartGridProps } from './StrengthChart.types';

/**
 * Renders horizontal grid lines (0%, 50%, 100%) as dashed lines.
 */
export const ChartGrid = React.memo(function ChartGrid({
  gridLines,
  chartWidth,
  paddingX = CHART_PADDING_X,
}: ChartGridProps) {
  return (
    <G>
      {gridLines.map((y, i) => (
        <Line
          key={i}
          opacity={GRID_LINE_OPACITY}
          stroke={COLORS.gridLine}
          strokeDasharray={GRID_LINE_DASH}
          strokeWidth={1}
          x1={paddingX}
          x2={chartWidth - paddingX}
          y1={y}
          y2={y}
        />
      ))}
    </G>
  );
});
