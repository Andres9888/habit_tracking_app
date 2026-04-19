/**
 * SVG chart sub-components for StrengthTimelineChart
 */

import React from 'react';
import { Circle, Line, G, Path } from 'react-native-svg';
import Animated from 'react-native-reanimated';

import { colors as themeTokens } from '@/theme/colors';
import {
  GRID_LINE_COUNT,
  DOT_RADIUS,
  ESTIMATED_PATH_LENGTH,
} from './constants';
import type { ChartDimensions, ChartPoint } from './types';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);

export function GridLines({ dimensions }: { dimensions: ChartDimensions }) {
  return (
    <G testID='grid-lines'>
      {Array.from({ length: GRID_LINE_COUNT }).map((_, index) => {
        const y =
          dimensions.paddingTop +
          (index / (GRID_LINE_COUNT - 1)) * dimensions.chartHeight;
        return (
          <Line
            key={`grid-${index}`}
            opacity={0.5}
            stroke='#d6d3d1'
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
  );
}

interface AnimatedLinePathProps {
  linePath: string;
  chartColor: string;
  animatedLineProps: Partial<{ strokeDashoffset: number }>;
}

export function AnimatedLinePath({
  linePath,
  chartColor,
  animatedLineProps,
}: AnimatedLinePathProps) {
  return (
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
  );
}

interface CurrentPositionDotProps {
  lastPoint: ChartPoint;
  chartColor: string;
  pulsingRingProps: Partial<{ opacity: number; r: number }>;
}

export function CurrentPositionDot({
  lastPoint,
  chartColor,
  pulsingRingProps,
}: CurrentPositionDotProps) {
  return (
    <G testID='current-position-dot'>
      <AnimatedCircle
        animatedProps={pulsingRingProps}
        cx={lastPoint.x}
        cy={lastPoint.y}
        fill={chartColor}
      />
      <Circle
        cx={lastPoint.x}
        cy={lastPoint.y}
        fill={chartColor}
        r={DOT_RADIUS}
        stroke={themeTokens.text.inverse}
        strokeWidth={2}
      />
    </G>
  );
}
