/**
 * ProgressRing - Animated circular progress ring for strength display
 */

import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated from 'react-native-reanimated';
import { RING_SIZE, RING_STROKE_WIDTH } from './constants';
import { useStrengthAnimation } from './useStrengthAnimation';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingProps {
  strength: number;
  ringColor: string;
  textColor: string;
  timeLabel: string;
}

export function ProgressRing({
  strength,
  ringColor,
  textColor,
  timeLabel,
}: ProgressRingProps) {
  const radius = (RING_SIZE - RING_STROKE_WIDTH) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = RING_SIZE / 2;

  const { displayedValue, animatedProps } = useStrengthAnimation({
    circumference,
    strength,
  });

  return (
    <View
      accessible
      accessibilityRole='progressbar'
      accessibilityValue={{ max: 100, min: 0, now: Math.round(strength) }}
      className='relative mb-2'
    >
      <Svg height={RING_SIZE} width={RING_SIZE}>
        <Circle
          cx={center}
          cy={center}
          fill='none'
          r={radius}
          stroke='#e7e5e4'
          strokeWidth={RING_STROKE_WIDTH}
        />
        <AnimatedCircle
          animatedProps={animatedProps}
          cx={center}
          cy={center}
          fill='none'
          origin={`${center}, ${center}`}
          r={radius}
          rotation='-90'
          stroke={ringColor}
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          strokeLinecap='round'
          strokeWidth={RING_STROKE_WIDTH}
        />
      </Svg>
      <View className='absolute inset-0 items-center justify-center'>
        <Text
          className='text-sm font-bold'
          style={{ color: textColor }}
          testID={`strength-value-${timeLabel.toLowerCase().replaceAll(/\s+/g, '-')}`}
        >
          {displayedValue}%
        </Text>
      </View>
    </View>
  );
}
