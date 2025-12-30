/**
 * StrengthTimelineChart Component
 *
 * SVG area chart displaying habit strength evolution over time since habit creation.
 *
 * Features:
 * - Gradient-filled area chart with bezier curve smoothing
 * - X-axis labels: Start, 6mo (if applicable), 1yr (if applicable), Now
 * - Pulsing dot at current position
 * - Responsive design adapting to container width
 * - Accessibility support with trend description
 */

import React, { useEffect, useMemo } from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Stop,
  Line,
  G,
} from 'react-native-svg';
import Animated, {
  Easing,
  FadeIn,
  useAnimatedProps,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { getStrengthColor } from './strengthUtils';
import type { StrengthSnapshot } from './types';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);

// Chart dimensions and styling constants
const DEFAULT_HEIGHT = 120;
const PADDING_LEFT = 12;
const PADDING_RIGHT = 12;
const PADDING_TOP = 16;
const PADDING_BOTTOM = 24;
const GRID_LINE_COUNT = 3; // 0%, 50%, 100% lines

// Animation constants
const PATH_ANIMATION_DURATION = 600;
const PATH_DRAW_DELAY = 200;
const PULSE_DURATION = 1500;
const DOT_RADIUS = 5;
const ESTIMATED_PATH_LENGTH = 1500; // Approximate max path length for animation

// Default emerald color if none provided
const DEFAULT_CHART_COLOR = '#10b981';

export interface StrengthTimelineChartProps {
  /** Array of strength snapshots for the timeline */
  strengthHistory: StrengthSnapshot[];
  /** Optional habit color for the chart gradient (hex) */
  habitColor?: string;
  /** Optional chart height (default: 120) */
  height?: number;
}

interface ChartDimensions {
  width: number;
  height: number;
  chartWidth: number;
  chartHeight: number;
  paddingLeft: number;
  paddingRight: number;
  paddingTop: number;
  paddingBottom: number;
}

interface XAxisLabel {
  text: string;
  x: number;
}

/**
 * Convert data points to SVG coordinates
 */
function dataToSvg(
  index: number,
  strength: number,
  dataLength: number,
  dimensions: ChartDimensions
): { x: number; y: number } {
  const { chartWidth, chartHeight, paddingLeft, paddingTop } = dimensions;

  // X coordinate: evenly distribute points across chart width
  const x =
    dataLength > 1
      ? paddingLeft + (index / (dataLength - 1)) * chartWidth
      : paddingLeft + chartWidth / 2;

  // Y coordinate: 0% at bottom, 100% at top
  const y = paddingTop + chartHeight - (strength / 100) * chartHeight;

  return { x, y };
}

/**
 * Generate a smooth bezier curve path through all data points.
 * Uses cubic bezier curves for smooth transitions.
 */
function generateAreaPath(
  data: StrengthSnapshot[],
  dimensions: ChartDimensions
): string {
  if (data.length === 0) return '';

  const { chartHeight, paddingLeft, paddingTop, chartWidth } = dimensions;
  const bottomY = paddingTop + chartHeight;

  if (data.length === 1) {
    // Single point: create a small area around it
    const point = dataToSvg(0, data[0].strength, 1, dimensions);
    const halfWidth = 20;
    return `
      M ${point.x - halfWidth} ${bottomY}
      L ${point.x - halfWidth} ${point.y}
      L ${point.x + halfWidth} ${point.y}
      L ${point.x + halfWidth} ${bottomY}
      Z
    `;
  }

  // Generate points
  const points = data.map((snapshot, index) =>
    dataToSvg(index, snapshot.strength, data.length, dimensions)
  );

  // Build the path with smooth bezier curves
  let path = `M ${paddingLeft} ${bottomY}`; // Start at bottom-left
  path += ` L ${points[0].x} ${points[0].y}`; // Line to first data point

  // Smooth curve through all points using cubic bezier
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    // Calculate control points using Catmull-Rom to Bezier conversion
    const tension = 0.3;
    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  // Close the path along the bottom
  const lastPoint = points.at(-1);
  path += ` L ${lastPoint.x} ${bottomY}`;
  path += ' Z';

  return path;
}

/**
 * Generate the line path (without the fill area) for the stroke
 */
function generateLinePath(
  data: StrengthSnapshot[],
  dimensions: ChartDimensions
): string {
  if (data.length === 0) return '';

  if (data.length === 1) {
    const point = dataToSvg(0, data[0].strength, 1, dimensions);
    return `M ${point.x} ${point.y}`;
  }

  const points = data.map((snapshot, index) =>
    dataToSvg(index, snapshot.strength, data.length, dimensions)
  );

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    const tension = 0.3;
    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  return path;
}

/**
 * Generate X-axis labels based on history length
 */
function generateXAxisLabels(
  historyDays: number,
  dimensions: ChartDimensions
): XAxisLabel[] {
  const { paddingLeft, chartWidth } = dimensions;
  const labels: XAxisLabel[] = [];

  // Always show Start and Now
  labels.push(
    { text: 'Start', x: paddingLeft },
    { text: 'Now', x: paddingLeft + chartWidth }
  );

  // Add intermediate labels based on duration
  if (historyDays >= 365) {
    // Show 6mo and 1yr markers
    const sixMonthRatio = 182 / historyDays;
    const oneYearRatio = 365 / historyDays;

    if (sixMonthRatio < 0.9) {
      // Don't show if too close to end
      labels.push({
        text: '6mo',
        x: paddingLeft + sixMonthRatio * chartWidth,
      });
    }

    if (oneYearRatio < 0.9) {
      labels.push({
        text: '1yr',
        x: paddingLeft + oneYearRatio * chartWidth,
      });
    }
  } else if (historyDays >= 180) {
    // Show just 6mo marker
    const sixMonthRatio = 182 / historyDays;
    if (sixMonthRatio < 0.9) {
      labels.push({
        text: '6mo',
        x: paddingLeft + sixMonthRatio * chartWidth,
      });
    }
  }

  // Sort labels by x position
  return labels.sort((a, b) => a.x - b.x);
}

/**
 * Calculate the overall trend direction for accessibility
 */
function calculateTrendDescription(data: StrengthSnapshot[]): string {
  if (data.length < 2) return 'Not enough data to determine trend';

  const first = data[0].strength;
  const last = data.at(-1).strength;
  const diff = last - first;

  if (diff > 10)
    return `Strength has increased from ${first.toFixed(0)}% to ${last.toFixed(0)}%`;
  if (diff < -10)
    return `Strength has decreased from ${first.toFixed(0)}% to ${last.toFixed(0)}%`;
  return `Strength has remained relatively stable around ${last.toFixed(0)}%`;
}

/**
 * StrengthTimelineChart - SVG area chart for habit strength history
 */
export function StrengthTimelineChart({
  strengthHistory,
  habitColor,
  height = DEFAULT_HEIGHT,
}: StrengthTimelineChartProps) {
  const { width: windowWidth } = useWindowDimensions();
  const shouldReduceMotion = useReducedMotion();

  // Calculate chart dimensions based on container
  const chartContainerWidth = windowWidth - 32; // Account for typical screen padding

  const dimensions = useMemo<ChartDimensions>(
    () => ({
      chartHeight: height - PADDING_TOP - PADDING_BOTTOM,
      chartWidth: chartContainerWidth - PADDING_LEFT - PADDING_RIGHT,
      height,
      paddingBottom: PADDING_BOTTOM,
      paddingLeft: PADDING_LEFT,
      paddingRight: PADDING_RIGHT,
      paddingTop: PADDING_TOP,
      width: chartContainerWidth,
    }),
    [chartContainerWidth, height]
  );

  // Determine chart color based on current strength or habit color
  const chartColor = useMemo(() => {
    if (habitColor) return habitColor;
    if (strengthHistory.length > 0) {
      return getStrengthColor(strengthHistory.at(-1).strength);
    }
    return DEFAULT_CHART_COLOR;
  }, [habitColor, strengthHistory]);

  // Generate paths
  const { areaPath, linePath, lastPoint } = useMemo(() => {
    if (strengthHistory.length === 0) {
      return { areaPath: '', lastPoint: null, linePath: '' };
    }

    const area = generateAreaPath(strengthHistory, dimensions);
    const line = generateLinePath(strengthHistory, dimensions);
    const last = dataToSvg(
      strengthHistory.length - 1,
      strengthHistory.at(-1).strength,
      strengthHistory.length,
      dimensions
    );

    return { areaPath: area, lastPoint: last, linePath: line };
  }, [strengthHistory, dimensions]);

  // Generate X-axis labels
  const xAxisLabels = useMemo(() => {
    return generateXAxisLabels(strengthHistory.length, dimensions);
  }, [strengthHistory.length, dimensions]);

  // Path drawing animation - animates line from start to end
  const pathProgress = useSharedValue(shouldReduceMotion ? 1 : 0);

  // Pulsing animation for the current dot
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(1);

  // Trigger path drawing animation
  useEffect(() => {
    if (shouldReduceMotion || strengthHistory.length < 7) {
      pathProgress.value = 1;
      return;
    }

    // Start from hidden (full dashOffset) and animate to visible (0 dashOffset)
    pathProgress.value = 0;
    pathProgress.value = withTiming(1, {
      duration: PATH_ANIMATION_DURATION,
      easing: Easing.out(Easing.cubic),
    });
  }, [shouldReduceMotion, strengthHistory.length, pathProgress]);

  useEffect(() => {
    if (shouldReduceMotion || !lastPoint) return;

    // Pulsing scale animation
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.4, {
          duration: PULSE_DURATION / 2,
          easing: Easing.out(Easing.ease),
        }),
        withTiming(1, {
          duration: PULSE_DURATION / 2,
          easing: Easing.in(Easing.ease),
        })
      ),
      -1, // Infinite repeat
      false
    );

    // Pulsing opacity animation for outer ring
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.3, {
          duration: PULSE_DURATION / 2,
          easing: Easing.out(Easing.ease),
        }),
        withTiming(0.8, {
          duration: PULSE_DURATION / 2,
          easing: Easing.in(Easing.ease),
        })
      ),
      -1,
      false
    );
  }, [shouldReduceMotion, lastPoint, pulseScale, pulseOpacity]);

  // Animated props for the pulsing outer ring
  const pulsingRingProps = useAnimatedProps(() => ({
    opacity: pulseOpacity.value,
    r: DOT_RADIUS * pulseScale.value,
  }));

  // Animated props for the line path drawing effect
  const animatedLineProps = useAnimatedProps(() => {
    const strokeDashoffset = ESTIMATED_PATH_LENGTH * (1 - pathProgress.value);
    return {
      strokeDashoffset,
    };
  });

  // Calculate trend description for accessibility
  const trendDescription = useMemo(
    () => calculateTrendDescription(strengthHistory),
    [strengthHistory]
  );

  // Handle empty state
  if (strengthHistory.length === 0) {
    return (
      <View
        accessible
        accessibilityLabel='Strength timeline chart - No data available yet'
        className='items-center justify-center rounded-xl bg-stone-50 p-4'
        style={{ height }}
      >
        <Text className='text-sm text-stone-400'>
          Building your strength history...
        </Text>
      </View>
    );
  }

  // Handle very short history (less than 7 days)
  if (strengthHistory.length < 7) {
    return (
      <Animated.View
        accessible
        accessibilityLabel='Strength timeline chart - Building history'
        className='items-center justify-center rounded-xl bg-stone-50 p-4'
        entering={FadeIn.duration(400)}
        style={{ height }}
      >
        <Text className='text-center text-sm text-stone-500'>
          Keep going! Your strength chart will appear after a week of tracking.
        </Text>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      accessible
      accessibilityLabel={`Strength timeline chart showing ${strengthHistory.length} days of history. ${trendDescription}`}
      accessibilityRole='image'
      className='overflow-hidden rounded-xl bg-stone-50'
      entering={FadeIn.duration(PATH_ANIMATION_DURATION)}
    >
      <Svg
        height={dimensions.height}
        testID='strength-timeline-svg'
        width={dimensions.width}
      >
        <Defs>
          {/* Gradient fill for the area */}
          <LinearGradient id='areaGradient' x1='0' x2='0' y1='0' y2='1'>
            <Stop offset='0%' stopColor={chartColor} stopOpacity={0.3} />
            <Stop offset='100%' stopColor={chartColor} stopOpacity={0.05} />
          </LinearGradient>
        </Defs>

        {/* Grid lines */}
        <G testID='grid-lines'>
          {Array.from({ length: GRID_LINE_COUNT }).map((_, index) => {
            const y =
              dimensions.paddingTop +
              (index / (GRID_LINE_COUNT - 1)) * dimensions.chartHeight;
            return (
              <Line
                key={`grid-${index}`}
                opacity={0.5}
                stroke='#d6d3d1' // stone-300
                strokeDasharray='4,4'
                strokeWidth={1}
                x1={dimensions.paddingLeft}
                x2={dimensions.paddingLeft + dimensions.chartWidth}
                y1={y}
                y2={y}
              />
            );
          })}
        </G>

        {/* Area fill */}
        <Path d={areaPath} fill='url(#areaGradient)' testID='area-path' />

        {/* Line stroke with drawing animation */}
        <AnimatedPath
          animatedProps={animatedLineProps}
          d={linePath}
          fill='none'
          stroke={chartColor}
          strokeDasharray={ESTIMATED_PATH_LENGTH}
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2.5}
          testID='line-path'
        />

        {/* Current position dot with pulse effect */}
        {lastPoint && (
          <G testID='current-position-dot'>
            {/* Pulsing outer ring */}
            <AnimatedCircle
              animatedProps={pulsingRingProps}
              cx={lastPoint.x}
              cy={lastPoint.y}
              fill={chartColor}
            />

            {/* Solid inner dot */}
            <Circle
              cx={lastPoint.x}
              cy={lastPoint.y}
              fill={chartColor}
              r={DOT_RADIUS}
              stroke='#ffffff'
              strokeWidth={2}
            />
          </G>
        )}
      </Svg>

      {/* X-axis labels */}
      <View
        className='absolute bottom-1 left-0 right-0 flex-row justify-between px-3'
        style={{ paddingLeft: PADDING_LEFT, paddingRight: PADDING_RIGHT }}
      >
        {xAxisLabels.map((label, index) => (
          <Text
            key={`${label.text}-${index}`}
            className='text-[10px] text-stone-400'
            style={{
              left: label.x,
              position: 'absolute',
              transform: [
                {
                  translateX:
                    label.text === 'Now'
                      ? -20
                      : label.text === 'Start'
                        ? 0
                        : -10,
                },
              ],
            }}
          >
            {label.text}
          </Text>
        ))}
      </View>
    </Animated.View>
  );
}

export default StrengthTimelineChart;
