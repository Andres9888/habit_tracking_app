/**
 * TrendLineChart Component
 * Displays habit strength trends over time using a line chart
 */

import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { CartesianChart, Line, Scatter } from 'victory-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { styles, chartWidth, chartHeight } from './styles';
import { EmptyState } from './EmptyState';
import { ChartTooltip } from './ChartTooltip';
import { ChartLegend } from './ChartLegend';
import type { TrendLineChartProps, TrendData } from './types';

export default function TrendLineChart({ data }: TrendLineChartProps) {
  const [selectedPoint, setSelectedPoint] = useState<TrendData | null>(null);
  const animationProgress = useSharedValue(0);

  useEffect(() => {
    animationProgress.value = withTiming(1, { duration: 500 });
  }, [data, animationProgress]);

  useEffect(() => {
    if (!data?.length) {
      setSelectedPoint(null);
      return;
    }
    setSelectedPoint(data.at(-1) ?? null);
  }, [data]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animationProgress.value, [0, 1], [0, 1]),
  }));

  if (!data || data.length === 0) {
    return <EmptyState />;
  }

  const chartData = data.map((item, dayIndex) => ({
    averageStrength: item.averageStrength,
    date: item.date,
    dayIndex,
  }));

  const tickValues = chartData
    .map((_, index) => index)
    .filter((index) => index % 7 === 0 || index === chartData.length - 1);

  const formatXLabel = (label: number) => {
    const index = Math.round(label);
    const item = chartData[index];
    if (!item) return '';
    const date = new Date(item.date);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      <View style={{ height: chartHeight, width: chartWidth }}>
        <CartesianChart
          data={chartData}
          domain={{ y: [0, 100] }}
          padding={{ bottom: 40, left: 50, right: 20, top: 20 }}
          xAxis={{
            formatXLabel,
            labelColor: colors.text.tertiary,
            labelRotate: -45,
            lineColor: colors.border,
            tickValues,
          }}
          xKey='dayIndex'
          yAxis={[
            {
              formatYLabel: (value) => `${Math.round(value)}%`,
              labelColor: colors.text.tertiary,
              lineColor: colors.border,
              tickCount: 5,
            },
          ]}
          yKeys={['averageStrength']}
        >
          {({ points }) => (
            <>
              <Line
                color={colors.primary[500]}
                curveType='catmullRom'
                points={points.averageStrength}
                strokeWidth={2.5}
              />
              <Scatter
                color={colors.primary[500]}
                points={points.averageStrength}
                radius={4}
                style='fill'
              />
            </>
          )}
        </CartesianChart>
      </View>
      <ChartTooltip selectedPoint={selectedPoint} />
      <ChartLegend />
    </Animated.View>
  );
}

export { TrendLineChart };
