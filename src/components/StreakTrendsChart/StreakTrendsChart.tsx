/**
 * StreakTrendsChart Component
 *
 * Displays streak trends over time using a line chart
 */

import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { CartesianChart, Line, Scatter, Tooltip } from 'victory-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { styles } from './StreakTrendsChart.styles';
import { EmptyState } from './EmptyState';
import type { StreakTrendsChartProps, StreakTrendData } from './StreakTrendsChart.types';

const AnimatedView = Animated.createAnimatedComponent(View);

export function StreakTrendsChart({ data, darkMode = false }: StreakTrendsChartProps) {
  const [selectedPoint, setSelectedPoint] = useState<StreakTrendData | null>(null);
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
    return <EmptyState darkMode={darkMode} />;
  }

  const chartData = data.map((item, dayIndex) => ({
    averageStreak: item.averageStreak,
    maxStreak: item.maxStreak,
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

  const themeColors = darkMode ? colors.dark : colors;

  const formatTooltip = ({ x, y }: { x: number; y: number }) => {
    const index = Math.round(x);
    const item = chartData[index];
    if (!item) return '';
    const date = new Date(item.date);
    return `${date.getMonth() + 1}/${date.getDate()}: ${item.averageStreak.toFixed(1)} days`;
  };

  return (
    <AnimatedView style={[styles.container, containerAnimatedStyle]}>
      <View style={{ height: 200, width: '100%' }}>
        <CartesianChart
          data={chartData}
          domain={{ y: [0, Math.max(...chartData.map((d) => d.maxStreak)) + 1] }}
          padding={{ bottom: 40, left: 50, right: 20, top: 20 }}
          xAxis={{
            formatXLabel,
            labelColor: themeColors.text.tertiary,
            labelRotate: -45,
            lineColor: themeColors.border,
            tickValues,
          }}
          xKey="dayIndex"
          yAxis={[
            {
              formatYLabel: (value) => `${Math.round(value)}`,
              labelColor: themeColors.text.tertiary,
              lineColor: themeColors.border,
              tickCount: 5,
              labelOffset: 8,
            },
          ]}
          yKeys={['averageStreak', 'maxStreak']}
        >
          {({ points }) => (
            <>
              <Line
                color={themeColors.primary[500]}
                curveType="catmullRom"
                points={points.averageStreak}
                strokeWidth={2.5}
              />
              <Scatter
                color={themeColors.primary[500]}
                points={points.averageStreak}
                radius={4}
                style="fill"
              />
              <Line
                color={themeColors.text.tertiary}
                curveType="catmullRom"
                points={points.maxStreak}
                strokeWidth={1.5}
                strokeDasharray={[4, 4]}
              />
              <Scatter
                color={themeColors.text.tertiary}
                points={points.maxStreak}
                radius={3}
                style="fill"
              />
            </>
          )}
        </CartesianChart>
      </View>
      {selectedPoint && (
        <View style={styles.tooltipContainer}>
          <Text style={[styles.tooltipText, { color: themeColors.text.primary }]}>
            {selectedPoint.averageStreak.toFixed(1)} avg streak
          </Text>
          <Text style={[styles.tooltipSubtext, { color: themeColors.text.tertiary }]}>
            Max: {selectedPoint.maxStreak} days
          </Text>
        </View>
      )}
    </AnimatedView>
  );
}

export default StreakTrendsChart;
