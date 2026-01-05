/**
 * StrengthChart Component
 *
 * Full-width timeline chart with:
 * - Smooth bezier curve line (Catmull-Rom interpolation)
 * - Gradient fill under the curve
 * - Horizontal grid lines (dashed)
 * - X-axis labels based on time range
 * - Pulsing dot at current position
 * - Path draw animation on mount
 *
 * @example
 * ```tsx
 * <StrengthChart
 *   data={strengthHistory}
 *   timeRange="1y"
 *   currentStrength={72}
 * />
 * ```
 */

import React, { useEffect, useMemo, useState } from 'react';
import { AccessibilityInfo, LayoutChangeEvent, Text, View } from 'react-native';

import { format, subDays, subMonths } from 'date-fns';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Stop,
} from 'react-native-svg';

import type { StrengthSnapshot } from '../HabitStrengthHistory/types';
import {
  ANIMATION,
  CHART_HEIGHT,
  CHART_PADDING_BOTTOM,
  CHART_PADDING_TOP,
  CHART_PADDING_X,
  COLORS,
  DOT_PULSE_RADIUS,
  DOT_RADIUS,
  GRID_LINE_COUNT,
  GRID_LINE_DASH,
  GRID_LINE_OPACITY,
  STRENGTH_COLORS,
} from './constants';
import type { StrengthChartProps, TimeRange } from './types';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/**
 * Catmull-Rom to Bezier curve conversion.
 * Creates smooth bezier curves through data points.
 */
function catmullRomToBezier(
  points: Array<{ x: number; y: number }>,
  tension = 0.5
): string {
  if (points.length < 2) return '';

  const path: string[] = [];
  path.push(`M ${points[0].x} ${points[0].y}`);

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    // Control points for the bezier curve
    const cp1x = p1.x + (p2.x - p0.x) * tension / 6;
    const cp1y = p1.y + (p2.y - p0.y) * tension / 6;
    const cp2x = p2.x - (p3.x - p1.x) * tension / 6;
    const cp2y = p2.y - (p3.y - p1.y) * tension / 6;

    path.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`);
  }

  return path.join(' ');
}

/**
 * Generate X-axis labels based on time range.
 */
function getXAxisLabels(timeRange: TimeRange): string[] {
  const now = new Date();

  switch (timeRange) {
    case '1m':
      return [
        format(subDays(now, 30), 'MMM d'),
        format(subDays(now, 15), 'MMM d'),
        'Now',
      ];
    case '1y':
      return [
        format(subMonths(now, 12), "MMM ''yy"),
        format(subMonths(now, 6), "MMM ''yy"),
        'Now',
      ];
    case 'all':
      return ['Start', 'Now'];
  }
}

/**
 * Get the current strength label for accessibility.
 */
function getStrengthLabel(strength: number): 'weak' | 'developing' | 'strong' {
  if (strength < 30) return 'weak';
  if (strength < 70) return 'developing';
  return 'strong';
}

/**
 * StrengthChart displays a full-width timeline of habit strength.
 */
export const StrengthChart = React.memo(function StrengthChart({
  data,
  timeRange,
  currentStrength,
  color,
}: StrengthChartProps) {
  const [chartWidth, setChartWidth] = useState(300);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Animation values
  const pathProgress = useSharedValue(0);
  const dotScale = useSharedValue(1);
  const dotOpacity = useSharedValue(1);

  // Get colors based on current strength
  const strengthLabel = getStrengthLabel(currentStrength);
  const colors = STRENGTH_COLORS[strengthLabel];
  const chartColor = color || colors.primary;

  // Check for reduce motion preference
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
  }, []);

  // Handle layout to get chart width
  const handleLayout = (event: LayoutChangeEvent) => {
    setChartWidth(event.nativeEvent.layout.width);
  };

  // Calculate chart dimensions
  const chartAreaWidth = chartWidth - CHART_PADDING_X * 2;
  const chartAreaHeight =
    CHART_HEIGHT - CHART_PADDING_TOP - CHART_PADDING_BOTTOM;

  // Convert data to chart points
  const { points, lastPoint, pathD, fillPathD, pathLength } = useMemo(() => {
    if (data.length < 2) {
      return {
        points: [],
        lastPoint: { x: chartWidth / 2, y: CHART_HEIGHT / 2 },
        pathD: '',
        fillPathD: '',
        pathLength: 0,
      };
    }

    // Map data points to chart coordinates
    const mappedPoints = data.map((snapshot, index) => ({
      x: CHART_PADDING_X + (index / (data.length - 1)) * chartAreaWidth,
      y:
        CHART_PADDING_TOP +
        chartAreaHeight -
        (snapshot.strength / 100) * chartAreaHeight,
    }));

    // Generate bezier curve path
    const curvePath = catmullRomToBezier(mappedPoints);

    // Create fill path (close the area under the curve)
    const fillPath = `${curvePath} L ${mappedPoints[mappedPoints.length - 1].x} ${
      CHART_PADDING_TOP + chartAreaHeight
    } L ${mappedPoints[0].x} ${CHART_PADDING_TOP + chartAreaHeight} Z`;

    // Estimate path length for animation
    const estimatedLength = mappedPoints.reduce((acc, point, i) => {
      if (i === 0) return 0;
      const prev = mappedPoints[i - 1];
      return acc + Math.sqrt((point.x - prev.x) ** 2 + (point.y - prev.y) ** 2);
    }, 0);

    return {
      points: mappedPoints,
      lastPoint: mappedPoints[mappedPoints.length - 1],
      pathD: curvePath,
      fillPathD: fillPath,
      pathLength: estimatedLength,
    };
  }, [data, chartWidth, chartAreaWidth, chartAreaHeight]);

  // Animate path draw and pulsing dot
  useEffect(() => {
    if (reduceMotion) {
      pathProgress.value = 1;
      dotScale.value = 1;
      return;
    }

    // Path draw animation
    pathProgress.value = 0;
    pathProgress.value = withTiming(1, {
      duration: ANIMATION.chartDrawDuration,
      easing: Easing.out(Easing.cubic),
    });

    // Pulsing dot animation
    dotScale.value = withRepeat(
      withSequence(
        withTiming(1.5, { duration: ANIMATION.pulseDuration / 2 }),
        withTiming(1, { duration: ANIMATION.pulseDuration / 2 })
      ),
      -1, // Infinite loop
      false
    );

    dotOpacity.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: ANIMATION.pulseDuration / 2 }),
        withTiming(1, { duration: ANIMATION.pulseDuration / 2 })
      ),
      -1,
      false
    );
  }, [data, reduceMotion, pathProgress, dotScale, dotOpacity]);

  // Animated path props for draw animation
  const animatedPathProps = useAnimatedProps(() => ({
    strokeDashoffset: pathLength * (1 - pathProgress.value),
  }));

  // Animated dot props for pulsing
  // Note: r can be fractional for SVG, but we round to avoid Reanimated precision errors
  const animatedDotProps = useAnimatedProps(() => ({
    r: Math.round(DOT_RADIUS * dotScale.value * 10) / 10,
    opacity: Math.round(dotOpacity.value * 100) / 100,
  }));

  // Get X-axis labels
  const xAxisLabels = getXAxisLabels(timeRange);

  // Generate accessibility description
  const accessibilityLabel = useMemo(() => {
    if (data.length < 2) return 'No strength history available';

    const startStrength = Math.round(data[0].strength);
    const endStrength = Math.round(data[data.length - 1].strength);
    const trend = endStrength > startStrength ? 'upward' : 'downward';

    return `Strength chart showing ${trend} trend from ${startStrength}% to ${endStrength}%`;
  }, [data]);

  // Grid lines (0%, 50%, 100%)
  const gridLines = useMemo(() => {
    return Array.from({ length: GRID_LINE_COUNT }, (_, i) => {
      const y =
        CHART_PADDING_TOP + (i / (GRID_LINE_COUNT - 1)) * chartAreaHeight;
      return y;
    });
  }, [chartAreaHeight]);

  if (data.length < 2) {
    return (
      <View
        className="items-center justify-center"
        style={{ height: CHART_HEIGHT }}
        accessibilityLabel="No strength history available yet"
      >
        <Text className="text-sm text-stone-400">
          Complete more days to see your strength chart
        </Text>
      </View>
    );
  }

  return (
    <View
      onLayout={handleLayout}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="image"
    >
      <Svg width={chartWidth} height={CHART_HEIGHT}>
        <Defs>
          {/* Gradient fill under the curve */}
          <LinearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={chartColor} stopOpacity={0.25} />
            <Stop offset="100%" stopColor={chartColor} stopOpacity={0.02} />
          </LinearGradient>
        </Defs>

        {/* Horizontal grid lines */}
        <G>
          {gridLines.map((y, i) => (
            <Line
              key={i}
              x1={CHART_PADDING_X}
              y1={y}
              x2={chartWidth - CHART_PADDING_X}
              y2={y}
              stroke={COLORS.gridLine}
              strokeWidth={1}
              strokeDasharray={GRID_LINE_DASH}
              opacity={GRID_LINE_OPACITY}
            />
          ))}
        </G>

        {/* Gradient fill area */}
        <Path d={fillPathD} fill="url(#areaGradient)" />

        {/* Main curve line */}
        <AnimatedPath
          animatedProps={animatedPathProps}
          d={pathD}
          stroke={chartColor}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeDasharray={pathLength}
        />

        {/* Pulsing dot at current position */}
        <AnimatedCircle
          animatedProps={animatedDotProps}
          cx={lastPoint.x}
          cy={lastPoint.y}
          fill={chartColor}
        />

        {/* Solid dot center */}
        <Circle
          cx={lastPoint.x}
          cy={lastPoint.y}
          r={DOT_RADIUS}
          fill={chartColor}
        />
      </Svg>

      {/* X-axis labels */}
      <View
        className="absolute bottom-0 left-0 right-0 flex-row justify-between px-4"
        style={{ height: CHART_PADDING_BOTTOM }}
      >
        {xAxisLabels.map((label, i) => (
          <Text key={i} className="text-xs text-stone-400">
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
});
