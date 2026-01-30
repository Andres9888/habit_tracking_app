/**
 * StrengthChart - Full-width timeline chart with smooth bezier curve,
 * gradient fill, grid lines, X-axis labels, and a pulsing dot.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { AccessibilityInfo, LayoutChangeEvent, View } from 'react-native';

import Svg from 'react-native-svg';

import {
  CHART_HEIGHT,
  CHART_PADDING_BOTTOM,
  CHART_PADDING_X,
  STRENGTH_COLORS,
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
  const [reduceMotion, setReduceMotion] = useState(false);

  const strengthLabel = getStrengthLabel(currentStrength);
  const chartColor = color || STRENGTH_COLORS[strengthLabel].primary;

  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
  }, []);

  const handleLayout = (event: LayoutChangeEvent) => {
    setChartWidth(event.nativeEvent.layout.width);
  };

  const { lastPoint, pathD, fillPathD, pathLength } = useChartData({
    chartWidth,
    data,
  });
  const gridLines = useChartGridLines();
  const { animatedPathProps, animatedDotProps } = useStrengthChartAnimations({
    dataLength: data.length,
    pathLength,
    reduceMotion,
  });

  const xAxisLabels = useMemo(() => getXAxisLabelsFromData(data), [data]);
  const accessibilityLabel = useMemo(() => {
    if (data.length < 2) return 'No strength history available';
    const startStrength = Math.round(data[0].strength);
    const endStrength = Math.round(data.at(-1).strength);
    const trend = endStrength > startStrength ? 'upward' : 'downward';
    return `Strength chart showing ${trend} trend from ${startStrength}% to ${endStrength}%`;
  }, [data]);

  if (data.length < 2) return <EmptyState />;

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
