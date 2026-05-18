/**
 * ProgressRing Component
 *
 * Circular SVG progress ring with animated fill.
 */

import React from 'react';
import { View } from 'react-native';

import Animated, { useAnimatedProps } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { useThemeColors } from '@/theme/ThemeContext';

import {
  getThemeColors,
  RING_CIRCUMFERENCE,
  RING_RADIUS,
  RING_SIZE,
  RING_STROKE_WIDTH,
  STRENGTH_LABELS,
} from '../constants';
import { AnimatedPercentage } from './AnimatedPercentage';
import type { ProgressRingProps } from './types';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/**
 * Displays a circular progress ring with animated percentage.
 */
export function ProgressRing({
  roundedStrength,
  ringColor,
  animatedStrength,
  label,
}: ProgressRingProps) {
  const { colors: themeColors } = useThemeColors();
  const sectionColors = getThemeColors(themeColors);
  const center = RING_SIZE / 2;

  // Animated props for the progress circle
  const animatedCircleProps = useAnimatedProps(() => {
    'worklet';
    const strengthValue = animatedStrength.value ?? 0;
    const progress = strengthValue / 100;
    return {
      strokeDashoffset: RING_CIRCUMFERENCE * (1 - progress),
    };
  });

  return (
    <View
      accessibilityLabel={`Habit strength ${roundedStrength}%, ${STRENGTH_LABELS[label]}`}
      accessibilityRole='progressbar'
      accessibilityValue={{ max: 100, min: 0, now: roundedStrength }}
      style={{ height: RING_SIZE, width: RING_SIZE }}
    >
      <Svg height={RING_SIZE} width={RING_SIZE}>
        {/* Background track */}
        <Circle
          cx={center}
          cy={center}
          fill='none'
          r={RING_RADIUS}
          stroke={sectionColors.ringTrack}
          strokeWidth={RING_STROKE_WIDTH}
        />
        {/* Progress arc */}
        <AnimatedCircle
          animatedProps={animatedCircleProps}
          cx={center}
          cy={center}
          fill='none'
          origin={`${center}, ${center}`}
          r={RING_RADIUS}
          rotation='-90'
          stroke={ringColor}
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={RING_CIRCUMFERENCE}
          strokeLinecap='round'
          strokeWidth={RING_STROKE_WIDTH}
        />
      </Svg>

      {/* Center content */}
      <View
        accessibilityElementsHidden
        className='absolute inset-0 items-center justify-center'
      >
        <AnimatedPercentage animatedValue={animatedStrength} />
      </View>
    </View>
  );
}
