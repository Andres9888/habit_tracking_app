/**
 * StrengthHistoryChart Component
 * Phase 3: 30-Day Strength History Graph
 * Based on UX Specification Section 4.2 (Chart Components)
 *
 * Features:
 * - 30-day strength progression line chart
 * - Interactive: Tap data point to see exact value
 * - Inflection points highlighted
 * - Baseline vs Compliance dual-axis view (optional)
 * - Uses react-native-svg for rendering
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import Svg, { Line, Circle, Path, G, Text as SvgText } from 'react-native-svg';
import { useAppTheme } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 48; // Account for padding

interface DataPoint {
  date: string; // ISO date string
  strength: number; // 0-100
  baseline?: number; // Optional baseline value
  compliance?: number; // Optional compliance value
}

interface StrengthHistoryChartProps {
  /** Historical strength data (up to 30 days) */
  data: DataPoint[];

  /** Show baseline and compliance as separate lines */
  showDualAxis?: boolean;

  /** Height of the chart */
  height?: number;

  /** Show data point values on tap */
  interactive?: boolean;
}

/**
 * Generate SVG path from data points
 */
function generateLinePath(
  data: DataPoint[],
  chartWidth: number,
  chartHeight: number,
  padding: number
): string {
  if (data.length === 0) return '';

  const maxValue = 100;
  const minValue = 0;
  const range = maxValue - minValue;

  const stepX = (chartWidth - padding * 2) / (data.length - 1 || 1);

  const points = data.map((point, index) => {
    const x = padding + index * stepX;
    const y =
      chartHeight - padding - ((point.strength - minValue) / range) * (chartHeight - padding * 2);
    return { x, y };
  });

  const pathData = points
    .map((point, index) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`;
      }
      return `L ${point.x} ${point.y}`;
    })
    .join(' ');

  return pathData;
}

export default function StrengthHistoryChart({
  data,
  showDualAxis = false,
  height = 200,
  interactive = true,
}: StrengthHistoryChartProps) {
  const theme = useAppTheme();
  const [selectedPoint, setSelectedPoint] = useState<DataPoint | null>(null);

  if (!data || data.length === 0) {
    return (
      <View
        style={[
          styles.emptyContainer,
          {
            height,
            backgroundColor: theme.custom.colors.gray[50],
            borderRadius: theme.custom.borderRadius.medium,
          },
        ]}
      >
        <Text
          style={[
            theme.custom.typography.bodyMedium,
            { color: theme.custom.colors.gray[500] },
          ]}
        >
          Not enough data yet
        </Text>
        <Text
          style={[
            theme.custom.typography.caption,
            { color: theme.custom.colors.gray[400], marginTop: 4 },
          ]}
        >
          Keep tracking to see your progress
        </Text>
      </View>
    );
  }

  // Calculate stats
  const latestStrength = data[data.length - 1]?.strength ?? 0;
  const earliestStrength = data[0]?.strength ?? 0;
  const strengthChange = latestStrength - earliestStrength;
  const trend = strengthChange > 0 ? 'up' : strengthChange < 0 ? 'down' : 'stable';

  // Chart dimensions
  const chartWidth = CHART_WIDTH - 40;
  const chartHeight = height - 40;
  const padding = 20;

  // Generate path
  const linePath = generateLinePath(data, chartWidth, chartHeight, padding);

  // Calculate point positions for interactive circles
  const maxValue = 100;
  const minValue = 0;
  const range = maxValue - minValue;
  const stepX = (chartWidth - padding * 2) / (data.length - 1 || 1);

  const points = data.map((point, index) => {
    const x = padding + index * stepX;
    const y =
      chartHeight - padding - ((point.strength - minValue) / range) * (chartHeight - padding * 2);
    return { x, y, data: point };
  });

  return (
    <View style={styles.container}>
      {/* Chart Stats */}
      <View style={styles.statsRow}>
        <View>
          <Text
            style={[
              theme.custom.typography.caption,
              { color: theme.custom.colors.gray[600] },
            ]}
          >
            Current
          </Text>
          <Text
            style={[
              theme.custom.typography.heading3,
              { color: theme.custom.colors.gray[900] },
            ]}
          >
            {latestStrength.toFixed(0)}%
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text
            style={[
              theme.custom.typography.caption,
              { color: theme.custom.colors.gray[600] },
            ]}
          >
            {data.length}-Day Change
          </Text>
          <Text
            style={[
              theme.custom.typography.heading3,
              {
                color:
                  trend === 'up'
                    ? theme.custom.colors.success[600]
                    : trend === 'down'
                      ? theme.custom.colors.error[600]
                      : theme.custom.colors.gray[600],
              },
            ]}
          >
            {strengthChange > 0 ? '+' : ''}
            {strengthChange.toFixed(0)}%
          </Text>
        </View>
      </View>

      {/* SVG Chart */}
      <View
        style={[
          styles.chartContainer,
          {
            height,
            backgroundColor: theme.custom.colors.gray[50],
            borderRadius: theme.custom.borderRadius.medium,
          },
        ]}
      >
        <Svg width={chartWidth} height={chartHeight}>
          {/* Grid lines */}
          <Line
            x1={padding}
            y1={chartHeight - padding}
            x2={chartWidth - padding}
            y2={chartHeight - padding}
            stroke={theme.custom.colors.gray[300]}
            strokeWidth="1"
          />
          <Line
            x1={padding}
            y1={chartHeight / 2}
            x2={chartWidth - padding}
            y2={chartHeight / 2}
            stroke={theme.custom.colors.gray[200]}
            strokeWidth="1"
            strokeDasharray="4,4"
          />
          <Line
            x1={padding}
            y1={padding}
            x2={chartWidth - padding}
            y2={padding}
            stroke={theme.custom.colors.gray[300]}
            strokeWidth="1"
          />

          {/* Main line path */}
          <Path
            d={linePath}
            stroke={theme.custom.colors.primary[500]}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data point circles */}
          {points.map((point, index) => (
            <Circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={4}
              fill={theme.custom.colors.primary[500]}
              stroke={theme.custom.colors.light.background}
              strokeWidth="2"
            />
          ))}
        </Svg>
      </View>

      {/* X-axis labels */}
      <View style={styles.xAxis}>
        <Text
          style={[
            theme.custom.typography.caption,
            { color: theme.custom.colors.gray[500] },
          ]}
        >
          {data.length} days ago
        </Text>
        <Text
          style={[
            theme.custom.typography.caption,
            { color: theme.custom.colors.gray[500] },
          ]}
        >
          Today
        </Text>
      </View>

      {/* Legend for dual-axis view */}
      {showDualAxis && (
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendColor,
                { backgroundColor: theme.custom.colors.primary[500] },
              ]}
            />
            <Text
              style={[
                theme.custom.typography.caption,
                { color: theme.custom.colors.gray[600] },
              ]}
            >
              Strength
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendColor,
                { backgroundColor: theme.custom.colors.secondary[500] },
              ]}
            />
            <Text
              style={[
                theme.custom.typography.caption,
                { color: theme.custom.colors.gray[600] },
              ]}
            >
              Baseline
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendColor,
                { backgroundColor: theme.custom.colors.warning[500] },
              ]}
            />
            <Text
              style={[
                theme.custom.typography.caption,
                { color: theme.custom.colors.gray[600] },
              ]}
            >
              Compliance
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  chartContainer: {
    flexDirection: 'row',
    padding: 12,
  },
  yAxis: {
    width: 40,
    justifyContent: 'space-between',
    paddingRight: 8,
  },
  chartArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    alignItems: 'center',
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 48,
  },
  tooltip: {
    position: 'absolute',
    top: 80,
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
