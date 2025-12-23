import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { CartesianChart, Line, Scatter } from 'victory-native';
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

  useEffect(() => {
    if (!data?.length) {
      setSelectedPoint(null);
      return;
    }
    setSelectedPoint(data[data.length - 1] ?? null);
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
    if (!item) {
      return '';
    }
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
            style={[styles.legendLine, { backgroundColor: colors.primary[500] }]}
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
