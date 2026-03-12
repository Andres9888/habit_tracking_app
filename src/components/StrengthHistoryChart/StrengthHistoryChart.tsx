/**
 * StrengthHistoryChart Component
 * Phase 3: 30-Day Strength History Graph
 */

import React from 'react';
import { View } from 'react-native';

import { CHART_WIDTH, styles } from './StrengthHistoryChart.styles';
import type { StrengthHistoryChartProps } from './StrengthHistoryChart.types';
import {
  calculateChartPoints,
  generateLinePath,
  getTrendDirection,
} from './StrengthHistoryChart.utils';
import {
  ChartLegend,
  ChartSvg,
  EmptyState,
  StatsRow,
  XAxisLabels,
} from './components';

const PADDING = 20;

export default function StrengthHistoryChart({
  data,
  showDualAxis = false,
  height = 200,
}: StrengthHistoryChartProps) {
  if (!data || data.length === 0) {
    return <EmptyState height={height} />;
  }

  const latestStrength = data.at(-1)?.strength ?? 0;
  const earliestStrength = data[0]?.strength ?? 0;
  const strengthChange = latestStrength - earliestStrength;
  const trend = getTrendDirection(strengthChange);

  const chartWidth = CHART_WIDTH - 40;
  const chartHeight = height - 40;

  const linePath = generateLinePath(data, chartWidth, chartHeight, PADDING);
  const points = calculateChartPoints(data, chartWidth, chartHeight, PADDING);

  return (
    <View style={styles.container}>
      <StatsRow
        dataLength={data.length}
        latestStrength={latestStrength}
        strengthChange={strengthChange}
        trend={trend}
      />

      <ChartSvg
        chartHeight={chartHeight}
        chartWidth={chartWidth}
        height={height}
        linePath={linePath}
        padding={PADDING}
        points={points}
      />

      <XAxisLabels dataLength={data.length} />

      {showDualAxis ? <ChartLegend /> : null}
    </View>
  );
}
