/**
 * ProgressRing Component
 *
 * Circular SVG progress ring with animated fill.
 */

import React from 'react';
import { Text, View } from 'react-native';

import Animated, { useAnimatedProps } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { useThemeColors } from '@/theme/ThemeContext';

import {
  getThemeColors,
  RING_CIRCUMFERENCE,
  RING_EMOJI_FONT_SIZE,
  RING_RADIUS,
  RING_SIZE,
  RING_STROKE_WIDTH,
} from '../constants';
import { AnimatedPercentage } from './AnimatedPercentage';
import type { ProgressRingProps } from './types';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/**
 * Displays a circular progress ring with the stage emoji and animated percentage.
 */
export function ProgressRing({
  roundedStrength,
  ringColor,
  animatedStrength,
  emoji,
  label,
}: ProgressRingProps) {
  const { colors: themeColors } = useThemeColors();
  const sectionColors = getThemeColors(themeColors);
  const center = RING_SIZE / 2;

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
      accessibilityLabel={`Habit strength ${roundedStrength}%, ${label}`}
      accessibilityRole='progressbar'
      accessibilityValue={{ max: 100, min: 0, now: roundedStrength }}
      style={{ height: RING_SIZE, width: RING_SIZE }}
    >
      <Svg height={RING_SIZE} width={RING_SIZE}>
        <Circle
          cx={center}
          cy={center}
          fill='none'
          r={RING_RADIUS}
          stroke={sectionColors.ringTrack}
          strokeWidth={RING_STROKE_WIDTH}
        />
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

      <Text
        accessibilityElementsHidden
        style={{
          fontSize: RING_EMOJI_FONT_SIZE,
          left: 0,
          lineHeight: RING_EMOJI_FONT_SIZE,
          position: 'absolute',
          right: 0,
          textAlign: 'center',
          top: 1,
        }}
      >
        {emoji}
      </Text>

      <View
        accessibilityElementsHidden
        className='absolute inset-0 items-center justify-center'
        style={{ paddingTop: RING_EMOJI_FONT_SIZE * 0.35 }}
      >
        <AnimatedPercentage animatedValue={animatedStrength} />
        <Text
          className='font-semibold'
          style={{
            color: sectionColors.textMuted,
            fontSize: 9,
            letterSpacing: 1,
            lineHeight: 11,
            marginTop: 1,
          }}
        >
          STRENGTH
        </Text>
      </View>
    </View>
  );
}
