/**
 * Main SVG container for StrengthTimelineChart
 */

import React from 'react';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import {
  GridLines,
  AnimatedLinePath,
  CurrentPositionDot,
} from './ChartElements';
import type { ChartDimensions, ChartPoint } from './types';

interface ChartSvgProps {
  dimensions: ChartDimensions;
  chartColor: string;
  areaPath: string;
  linePath: string;
  lastPoint: ChartPoint | null;
  animatedLineProps: Partial<{ strokeDashoffset: number }>;
  pulsingRingProps: Partial<{ opacity: number; r: number }>;
}

export function ChartSvg({
  dimensions,
  chartColor,
  areaPath,
  linePath,
  lastPoint,
  animatedLineProps,
  pulsingRingProps,
}: ChartSvgProps) {
  return (
    <Svg
      height={dimensions.height}
      testID='strength-timeline-svg'
      width={dimensions.width}
    >
      <Defs>
        <LinearGradient id='areaGradient' x1='0' x2='0' y1='0' y2='1'>
          <Stop offset='0%' stopColor={chartColor} stopOpacity={0.3} />
          <Stop offset='100%' stopColor={chartColor} stopOpacity={0.05} />
        </LinearGradient>
      </Defs>

      <GridLines dimensions={dimensions} />
      <Path d={areaPath} fill='url(#areaGradient)' testID='area-path' />
      <AnimatedLinePath
        animatedLineProps={animatedLineProps}
        chartColor={chartColor}
        linePath={linePath}
      />
      {lastPoint ? <CurrentPositionDot
          chartColor={chartColor}
          lastPoint={lastPoint}
          pulsingRingProps={pulsingRingProps}
        /> : null}
    </Svg>
  );
}
