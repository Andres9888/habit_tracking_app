import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { Pie, PolarChart } from 'victory-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { durations, springs } from '@/theme/animations';
import { styles } from './StrengthDistributionChart.styles';
import {
  CHART_SIZE,
  LEVEL_COLORS,
  STRENGTH_LEVELS,
} from './StrengthDistributionChart.constants';
import { Legend } from './components';
import type {
  StrengthDistributionChartProps,
  ChartDataItem,
} from './StrengthDistributionChart.types';

export default function StrengthDistributionChart({
  data,
  onSegmentPress,
}: StrengthDistributionChartProps) {
  const animationProgress = useSharedValue(0);
  const containerScale = useSharedValue(0);

  useEffect(() => {
    containerScale.value = withSpring(1, springs.gentle);
    animationProgress.value = withTiming(1, { duration: durations.emphasis });
  }, [data, animationProgress, containerScale]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(containerScale.value, [0, 1], [0, 1]),
    transform: [{ scale: containerScale.value }],
  }));

  if (!data || data.total === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No habits to display</Text>
        <Text style={styles.emptySubtext}>
          Create your first habit to see analytics
        </Text>
      </View>
    );
  }

  const chartData: ChartDataItem[] = STRENGTH_LEVELS.map((level) => ({
    color: LEVEL_COLORS[level],
    label: `${data[level].percentage.toFixed(0)}%`,
    level,
    value: data[level].count,
  })).filter((item) => item.value > 0);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.chartContainer, containerAnimatedStyle]}>
        <View style={styles.chartWrapper}>
          <PolarChart
            colorKey={'color' as never}
            data={chartData as unknown as Record<string, unknown>[]}
            labelKey={'label' as never}
            valueKey={'value' as never}
          >
            <Pie.Chart innerRadius={CHART_SIZE * 0.3} />
          </PolarChart>
        </View>
        <View style={styles.centerLabel}>
          <Text style={styles.centerLabelValue}>{data.total}</Text>
          <Text style={styles.centerLabelText}>Total Habits</Text>
        </View>
      </Animated.View>
      <Legend data={data} onSegmentPress={onSegmentPress} />
    </View>
  );
}
