/**
 * StrengthChart - Full-width timeline chart with smooth bezier curve,
 * gradient fill, grid lines, X-axis labels, and a pulsing dot.
 */
import React, { useMemo, useState } from 'react';
import { LayoutChangeEvent, View } from 'react-native';

import Svg from 'react-native-svg';

import { useThemeColors } from '@/theme/ThemeContext';

import { useReduceMotion } from '../../../hooks/useReduceMotion';
import {
  CHART_HEIGHT,
  CHART_PADDING_BOTTOM,
  CHART_PADDING_X,
  getStrengthColors,
} from '../constants';
import type { StrengthChartProps } from '../types';

import { ChartCurve } from './ChartCurve';
import { ChartGrid } from './ChartGrid';
import { EmptyState } from './EmptyState';
import { PulsingDot } from './PulsingDot';
import {
  getStrengthLabel,
  getXAxisLabelsFromData,
} from './StrengthChart.utils';
import { useChartData } from './useChartData';
import { useChartGridLines } from './useChartGridLines';
import { useStrengthChartAnimations } from './useStrengthChartAnimations';
import { XAxisLabels } from './XAxisLabels';

export const StrengthChart = React.memo(function StrengthChart({
  data,
  currentStrength,
  color,
}: StrengthChartProps) {
  const [chartWidth, setChartWidth] = useState(300);
  const { colors: themeColors } = useThemeColors();
  const reduceMotion = useReduceMotion();

  const strengthLabel = getStrengthLabel(currentStrength);
  const strengthColors = getStrengthColors(themeColors);
  const chartColor = color || strengthColors[strengthLabel].primary;

  const handleLayout = (event: LayoutChangeEvent) => {
    setChartWidth(event.nativeEvent.layout.width);
  };

  // Guard against undefined/null data early
  const safeData = data ?? [];

  const { lastPoint, pathD, fillPathD, pathLength } = useChartData({
    chartWidth,
    data: safeData,
  });
  const gridLines = useChartGridLines();
  const { animatedPathProps, animatedDotProps } = useStrengthChartAnimations({
    dataLength: safeData.length,
    pathLength,
    reduceMotion,
  });

  const xAxisLabels = useMemo(
    () => getXAxisLabelsFromData(safeData),
    [safeData]
  );
  const accessibilityLabel = useMemo(() => {
    if (safeData.length < 2) return 'No strength history available';
    const firstData = safeData[0];
    const lastData = safeData.at(-1);
    if (!firstData || !lastData) return 'No strength history available';
    const startStrength = Math.round(firstData.strength);
    const endStrength = Math.round(lastData.strength);
    const trend = endStrength > startStrength ? 'upward' : 'downward';
    return `Strength chart showing ${trend} trend from ${startStrength}% to ${endStrength}%`;
  }, [safeData]);

  if (safeData.length < 2) return <EmptyState />;

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='image'
      onLayout={handleLayout}
    >
      <Svg height={CHART_HEIGHT} width={chartWidth}>
        <ChartGrid
          chartWidth={chartWidth}
          gridLines={gridLines}
          paddingX={CHART_PADDING_X}
        />
        <ChartCurve
          animatedPathProps={animatedPathProps}
          chartColor={chartColor}
          fillPathD={fillPathD}
          pathD={pathD}
          pathLength={pathLength}
        />
        <PulsingDot
          animatedDotProps={animatedDotProps}
          color={chartColor}
          cx={lastPoint.x}
          cy={lastPoint.y}
        />
      </Svg>
      <XAxisLabels height={CHART_PADDING_BOTTOM} labels={xAxisLabels} />
    </View>
  );
});
