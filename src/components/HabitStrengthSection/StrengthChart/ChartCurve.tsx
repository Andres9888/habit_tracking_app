/**
 * ChartCurve Component
 *
 * Renders the flat fill area and animated curve line.
 */

import React from 'react';

import Animated from 'react-native-reanimated';
import { Path } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface ChartCurveProps {
  /** SVG path for the fill area */
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
 * Renders the flat-filled area and animated bezier curve.
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
      {/* Flat fill area */}
      <Path d={fillPathD} fill={chartColor} fillOpacity={0.08} />

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
