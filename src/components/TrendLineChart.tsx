import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
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
    label: `${Math.round(item.averageStrength)}%`,
    originalData: item,
    x: index,
    y: item.averageStrength,
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
        height={chartHeight}
        padding={{ bottom: 40, left: 50, right: 20, top: 20 }}
        width={chartWidth}
      >
        {/* X Axis */}
        <VictoryAxis
          dependentAxis={false}
          style={{
            axis: { stroke: colors.border },
            grid: {
              opacity: 0.3,
              stroke: colors.border,
              strokeDasharray: '2,2',
            },
            tickLabels: {
              angle: -45,
              fill: colors.text.tertiary,
              fontSize: 10,
            },
          }}
          tickFormat={(t, i) => xAxisLabels[i] || ''}
        />

        {/* Y Axis */}
        <VictoryAxis
          dependentAxis
          domain={[0, 100]}
          style={{
            axis: { stroke: colors.border },
            grid: {
              opacity: 0.3,
              stroke: colors.border,
              strokeDasharray: '2,2',
            },
            tickLabels: {
              fill: colors.text.tertiary,
              fontSize: 10,
            },
          }}
          tickFormat={(t) => `${t}%`}
        />

        {/* Line */}
        <VictoryLine
          animate={{
            duration: 500,
            onLoad: { duration: 500 },
          }}
          data={chartData}
          interpolation='catmullRom'
          style={{
            data: {
              stroke: colors.primary,
              strokeWidth: 2.5,
            },
          }}
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
          <View
            style={[styles.legendLine, { backgroundColor: colors.primary }]}
          />
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
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    height: 200,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptySubtext: {
    ...typography.body,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  emptyText: {
    ...typography.h3,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  legendItem: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  legendLine: {
    height: 2,
    marginRight: spacing.xs,
    width: 20,
  },
  legendText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  tooltip: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: spacing.sm,
    position: 'absolute',
    elevation: 5,
    right: spacing.md,
    shadowColor: '#000',
    top: spacing.md,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
});
