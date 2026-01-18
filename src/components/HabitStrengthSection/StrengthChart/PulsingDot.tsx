/**
 * PulsingDot Component
 *
 * Animated dot that pulses at the current chart position.
 */

import React from 'react';

import Animated from 'react-native-reanimated';
import { Circle } from 'react-native-svg';

import { DOT_RADIUS } from '../constants';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface PulsingDotProps {
  /** X coordinate */
  cx: number;
  /** Y coordinate */
  cy: number;
  /** Dot fill color */
  color: string;
  /** Animated props from useAnimatedProps */
  animatedDotProps: object;
}

/**
 * Renders an animated pulsing dot with a solid center.
 */
export const PulsingDot = React.memo(function PulsingDot({
  cx,
  cy,
  color,
  animatedDotProps,
}: PulsingDotProps) {
  return (
    <>
      {/* Pulsing outer dot */}
      <AnimatedCircle
        animatedProps={animatedDotProps}
        cx={cx}
        cy={cy}
        fill={color}
      />

      {/* Solid dot center */}
      <Circle cx={cx} cy={cy} fill={color} r={DOT_RADIUS} />
    </>
  );
});
