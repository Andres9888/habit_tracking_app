/**
 * StrengthRing Component
 *
 * SVG ring showing the strength percentage with animated fill.
 */

import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { type SharedValue } from 'react-native-reanimated';

import {
  RING_SIZE,
  STROKE_WIDTH,
  RADIUS,
  CIRCUMFERENCE,
  CENTER,
} from './constants';
import { AnimatedPercentageText } from '../AnimatedPercentageText';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface StrengthRingProps {
  currentLevelColor: string;
  currentLevelEmoji: string;
  animatedCircleProps: Partial<{ strokeDashoffset: number }>;
  emojiAnimatedStyle: object;
  animatedStrength: SharedValue<number>;
}

export function StrengthRing({
  currentLevelColor,
  currentLevelEmoji,
  animatedCircleProps,
  emojiAnimatedStyle,
  animatedStrength,
}: StrengthRingProps) {
  return (
    <View
      style={{
        elevation: 4,
        height: RING_SIZE,
        shadowColor: currentLevelColor,
        shadowOffset: { height: 0, width: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        width: RING_SIZE,
      }}
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
          stroke={currentLevelColor}
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
        <Animated.Text className='text-2xl' style={emojiAnimatedStyle}>
          {currentLevelEmoji}
        </Animated.Text>
        <AnimatedPercentageText animatedValue={animatedStrength} />
      </View>
    </View>
  );
}
