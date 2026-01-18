import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  SharedValue,
} from 'react-native-reanimated';
import type { LevelConfig } from '../types';
import { RING_SIZE, STROKE_WIDTH } from './constants';
import { AnimatedPercentageText } from './AnimatedPercentageText';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const radius = (RING_SIZE - STROKE_WIDTH) / 2;
const circumference = 2 * Math.PI * radius;
const center = RING_SIZE / 2;

interface ProgressRingProps {
  animatedStrength: SharedValue<number>;
  emojiAnimatedStyle: { transform: { scale: number }[] };
  level: LevelConfig;
}

export function ProgressRing({
  animatedStrength,
  emojiAnimatedStyle,
  level,
}: ProgressRingProps) {
  const animatedCircleProps = useAnimatedProps(() => {
    const progress = animatedStrength.value / 100;
    return {
      strokeDashoffset: circumference * (1 - progress),
    };
  });

  return (
    <View style={{ height: RING_SIZE, width: RING_SIZE }}>
      <Svg height={RING_SIZE} width={RING_SIZE}>
        {/* Background track */}
        <Circle
          cx={center}
          cy={center}
          fill='none'
          r={radius}
          stroke='#f3f4f6'
          strokeWidth={STROKE_WIDTH}
        />
        {/* Progress arc */}
        <AnimatedCircle
          animatedProps={animatedCircleProps}
          cx={center}
          cy={center}
          fill='none'
          origin={`${center}, ${center}`}
          r={radius}
          rotation='-90'
          stroke={level.color}
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          strokeLinecap='round'
          strokeWidth={STROKE_WIDTH}
        />
      </Svg>

      {/* Center content */}
      <View
        className='absolute items-center justify-center'
        style={{ height: RING_SIZE, width: RING_SIZE }}
      >
        <Animated.Text className='text-xl' style={emojiAnimatedStyle}>
          {level.emoji}
        </Animated.Text>
        <AnimatedPercentageText animatedValue={animatedStrength} />
      </View>
    </View>
  );
}
