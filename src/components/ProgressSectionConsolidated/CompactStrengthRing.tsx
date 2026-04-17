/**
 * CompactStrengthRing Component
 * A compact 56px strength ring for StatsGrid with animated SVG
 */

import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated from 'react-native-reanimated';

import type { CompactStrengthRingProps } from './StatsGridTypes';
import { TrendBadge } from './TrendBadge';
import {
  useStrengthRingAnimation,
  RING_CONSTANTS,
} from './useStrengthRingAnimation';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const { CENTER, CIRCUMFERENCE, RADIUS, RING_SIZE, STROKE_WIDTH } =
  RING_CONSTANTS;

export const CompactStrengthRing = React.memo(function CompactStrengthRing({
  strength,
  weeklyChange = 0,
  progressEmojis,
}: CompactStrengthRingProps) {
  const { animatedCircleProps, clampedStrength, levelInfo } =
    useStrengthRingAnimation(strength, progressEmojis);

  const accessibilityLabel = `Habit strength at ${Math.round(clampedStrength)} percent${
    weeklyChange === 0
      ? ''
      : `, ${weeklyChange > 0 ? 'up' : 'down'} ${Math.abs(weeklyChange)} percent this week`
  }`;

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='progressbar'
      accessibilityValue={{ max: 100, min: 0, now: clampedStrength }}
      className='relative'
      style={{ height: RING_SIZE, width: RING_SIZE }}
    >
      <Svg height={RING_SIZE} width={RING_SIZE}>
        <Circle
          cx={CENTER}
          cy={CENTER}
          fill='none'
          r={RADIUS}
          stroke='#f3f4f6'
          strokeWidth={STROKE_WIDTH}
        />
        <AnimatedCircle
          animatedProps={animatedCircleProps}
          cx={CENTER}
          cy={CENTER}
          fill='none'
          origin={`${CENTER}, ${CENTER}`}
          r={RADIUS}
          rotation='-90'
          stroke={levelInfo.color}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
          strokeLinecap='round'
          strokeWidth={STROKE_WIDTH}
        />
      </Svg>
      <View
        className='absolute items-center justify-center'
        style={{ height: RING_SIZE, width: RING_SIZE }}
      >
        <Text className='text-lg'>{levelInfo.emoji}</Text>
      </View>
      <TrendBadge weeklyChange={weeklyChange} />
    </View>
  );
});

export default CompactStrengthRing;
