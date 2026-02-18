import React, { useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
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

/**
 * Lightweight pie chart implementation using SVG
 * Replaced victory-native to reduce bundle size by 435MB
 */

function generatePiePath(
  cx: number,
  cy: number,
  radius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number
): string {
  const startRad = (startAngle - 90) * (Math.PI / 180);
  const endRad = (endAngle - 90) * (Math.PI / 180);

  const x1 = cx + radius * Math.cos(startRad);
  const y1 = cy + radius * Math.sin(startRad);
  const x2 = cx + radius * Math.cos(endRad);
  const y2 = cy + radius * Math.sin(endRad);

  const ix1 = cx + innerRadius * Math.cos(startRad);
  const iy1 = cy + innerRadius * Math.sin(startRad);
  const ix2 = cx + innerRadius * Math.cos(endRad);
  const iy2 = cy + innerRadius * Math.sin(endRad);

  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return (
    `M ${x1} ${y1} ` +
    `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} ` +
    `L ${ix2} ${iy2} ` +
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1} ` +
    `Z`
  );
}

export default function StrengthDistributionChart({
  data,
  onSegmentPress,
}: StrengthDistributionChartProps) {
  const animationProgress = useSharedValue(0);
  const containerScale = useSharedValue(0);

  useEffect(() => {
    containerScale.value = withSpring(1, { damping: 15, stiffness: 100 });
    animationProgress.value = withTiming(1, { duration: 400 });
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

  // Calculate pie slices
  let currentAngle = 0;
  const slices = chartData.map((item) => {
    const sliceAngle = (item.value / data.total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    currentAngle = endAngle;

    return {
      ...item,
      startAngle,
      endAngle,
    };
  });

  const chartRadius = CHART_SIZE / 2;
  const innerRadius = chartRadius * 0.3;
  const centerX = chartRadius;
  const centerY = chartRadius;

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.chartContainer, containerAnimatedStyle]}>
        <View style={styles.chartWrapper}>
          <Svg width={CHART_SIZE} height={CHART_SIZE} viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}>
            {/* Pie slices */}
            {slices.map((slice, index) => (
              <Path
                key={`slice-${index}`}
                d={generatePiePath(
                  centerX,
                  centerY,
                  chartRadius,
                  innerRadius,
                  slice.startAngle,
                  slice.endAngle
                )}
                fill={slice.color}
              />
            ))}
          </Svg>
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
