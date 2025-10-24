import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryScatter,
  VictoryLabel,
  VictoryContainer,
  VictoryVoronoiContainer,
  VictoryTooltip,
} from 'victory-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

const { width: screenWidth } = Dimensions.get('window');
const chartWidth = screenWidth - spacing.xl * 2;
const chartHeight = 200;

interface TrendData {
  date: string;
  averageStrength: number;
}

interface Props {
  data: TrendData[] | null;
  onDataPointPress?: (dataPoint: TrendData) => void;
}

export default function TrendLineChart({ data, onDataPointPress }: Props) {
  const [selectedPoint, setSelectedPoint] = useState<TrendData | null>(null);
  const animationProgress = useSharedValue(0);

  useEffect(() => {
    // Animate line drawing
    animationProgress.value = withTiming(1, { duration: 500 });
  }, [data]);

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(animationProgress.value, [0, 1], [0, 1]),
    };
  });

  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No trend data available</Text>
        <Text style={styles.emptySubtext}>
          Track habits for at least 7 days to see trends
        </Text>
      </View>
    );
  }

  // Format data for Victory
  const chartData = data.map((item, index) => ({
    x: index,
    y: item.averageStrength,
    label: `${Math.round(item.averageStrength)}%`,
    originalData: item,
  }));

  // Generate x-axis labels (show every 7 days)
  const xAxisLabels = data.map((item, index) => {
    if (index % 7 === 0) {
      const date = new Date(item.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }
    return '';
  });

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      <VictoryChart
        width={chartWidth}
        height={chartHeight}
        padding={{ left: 50, top: 20, right: 20, bottom: 40 }}
        containerComponent={
          <VictoryVoronoiContainer
            onActivateData={(points) => {
              if (points && points.length > 0) {
                const point = points[0];
                setSelectedPoint(point.originalData);
                onDataPointPress?.(point.originalData);
              }
            }}
          />
        }
      >
        {/* X Axis */}
        <VictoryAxis
          dependentAxis={false}
          style={{
            axis: { stroke: colors.border },
            tickLabels: {
              fontSize: 10,
              fill: colors.text.tertiary,
              angle: -45,
            },
            grid: { stroke: colors.border, strokeDasharray: '2,2', opacity: 0.3 },
          }}
          tickFormat={(t, i) => xAxisLabels[i] || ''}
        />

        {/* Y Axis */}
        <VictoryAxis
          dependentAxis
          domain={[0, 100]}
          style={{
            axis: { stroke: colors.border },
            tickLabels: {
              fontSize: 10,
              fill: colors.text.tertiary,
            },
            grid: { stroke: colors.border, strokeDasharray: '2,2', opacity: 0.3 },
          }}
          tickFormat={(t) => `${t}%`}
        />

        {/* Line */}
        <VictoryLine
          data={chartData}
          style={{
            data: {
              stroke: colors.primary,
              strokeWidth: 2.5,
            },
          }}
          animate={{
            duration: 500,
            onLoad: { duration: 500 },
          }}
          interpolation="catmullRom"
        />

        {/* Data Points */}
        <VictoryScatter
          data={chartData}
          size={4}
          style={{
            data: {
              fill: colors.primary,
              stroke: colors.surface,
              strokeWidth: 2,
            },
          }}
        />
      </VictoryChart>

      {/* Selected Point Detail */}
      {selectedPoint && (
        <View style={styles.tooltip}>
          <Text style={styles.tooltipDate}>
            {new Date(selectedPoint.date).toLocaleDateString()}
          </Text>
          <Text style={styles.tooltipValue}>
            {Math.round(selectedPoint.averageStrength)}% Average Strength
          </Text>
        </View>
      )}

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendLine, { backgroundColor: colors.primary }]} />
          <Text style={styles.legendText}>Average Habit Strength</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  emptyText: {
    ...typography.h3,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    ...typography.body,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  tooltip: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: colors.background,
    padding: spacing.sm,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  tooltipDate: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xxs,
  },
  tooltipValue: {
    ...typography.bodyBold,
    color: colors.text.primary,
    fontSize: 12,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendLine: {
    width: 20,
    height: 2,
    marginRight: spacing.xs,
  },
  legendText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
});