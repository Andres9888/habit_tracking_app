/**
 * ChartCurve Component
 *
 * Renders the gradient fill area and animated curve line.
 */

import React from 'react';

import Animated from 'react-native-reanimated';
import { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface ChartCurveProps {
  /** SVG path for gradient fill area */
  fillPathD: string;
  /** SVG path for the curve line */
  pathD: string;
  /** Curve stroke color */
  chartColor: string;
  /** Estimated path length (for animation) */
  pathLength: number;
  /** Animated props from useAnimatedProps */
  animatedPathProps: object;
}

/**
 * Renders the gradient-filled area and animated bezier curve.
 */
export const ChartCurve = React.memo(function ChartCurve({
  fillPathD,
  pathD,
  chartColor,
  pathLength,
  animatedPathProps,
}: ChartCurveProps) {
  return (
    <>
      <Defs>
        {/* Gradient fill under the curve */}
        <LinearGradient id='areaGradient' x1='0' x2='0' y1='0' y2='1'>
          <Stop offset='0%' stopColor={chartColor} stopOpacity={0.25} />
          <Stop offset='100%' stopColor={chartColor} stopOpacity={0.02} />
        </LinearGradient>
      </Defs>

      {/* Gradient fill area */}
      <Path d={fillPathD} fill='url(#areaGradient)' />

      {/* Main curve line with draw animation */}
      <AnimatedPath
        animatedProps={animatedPathProps}
        d={pathD}
        fill='none'
        stroke={chartColor}
        strokeDasharray={pathLength}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2.5}
      />
    </>
  );
});
