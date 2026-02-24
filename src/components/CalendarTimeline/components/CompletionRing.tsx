import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { fontFamilies } from '@/theme/typography';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CompletionRingProps {
  completed: number;
  total: number;
  reduceMotion?: boolean;
}

const RING_SIZE = 36;
const STROKE_WIDTH = 3;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const RING_COLORS = {
  track: '#f5f5f4', // stone-100
  progress: '#10b981', // emerald-500
  text: '#44403c', // stone-700
  completeText: '#059669', // emerald-600
};

/** Circular progress ring showing daily completion ratio */
export const CompletionRing: React.FC<CompletionRingProps> = ({
  completed,
  total,
  reduceMotion = false,
}) => {
  const animatedProgress = useRef(new Animated.Value(0)).current;
  const ratio = total > 0 ? completed / total : 0;
  const isComplete = completed === total && total > 0;

  useEffect(() => {
    if (reduceMotion) {
      animatedProgress.setValue(ratio);
      return;
    }

    Animated.timing(animatedProgress, {
      duration: 600,
      toValue: ratio,
      useNativeDriver: false,
    }).start();
  }, [ratio, animatedProgress, reduceMotion]);

  const strokeDashoffset = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCUMFERENCE, 0],
  });

  if (total === 0) return null;

  return (
    <View
      style={{
        width: RING_SIZE,
        height: RING_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Svg
        height={RING_SIZE}
        width={RING_SIZE}
        style={{ transform: [{ rotate: '-90deg' }] }}
      >
        <Circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          fill='transparent'
          r={RADIUS}
          stroke={RING_COLORS.track}
          strokeWidth={STROKE_WIDTH}
        />
        <AnimatedCircle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          fill='transparent'
          r={RADIUS}
          stroke={RING_COLORS.progress}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap='round'
          strokeWidth={STROKE_WIDTH}
        />
      </Svg>
      <Text
        style={{
          color: isComplete ? RING_COLORS.completeText : RING_COLORS.text,
          fontFamily: fontFamilies.primary.text,
          fontSize: 10,
          fontWeight: '800',
          position: 'absolute',
        }}
      >
        {completed}/{total}
      </Text>
    </View>
  );
};
