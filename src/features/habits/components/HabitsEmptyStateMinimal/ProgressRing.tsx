/**
 * ProgressRing - SVG circular progress indicator for success state
 */

import { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedProps,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useThemeColors } from '@/theme/ThemeContext';
import { PROGRESS_RING } from './animations';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface ProgressRingProps {
  duration?: number;
  size?: number;
  onComplete?: () => void;
}

export function ProgressRing({
  duration = PROGRESS_RING.duration,
  size = PROGRESS_RING.size,
  onComplete,
}: ProgressRingProps) {
  const shouldReduceMotion = useReducedMotion();
  const { colors } = useThemeColors();

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const strokeWidth = PROGRESS_RING.strokeWidth;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const progress = useSharedValue(0);

  useEffect(() => {
    if (shouldReduceMotion) {
      progress.value = 1;
      onCompleteRef.current?.();
      return;
    }

    progress.value = withTiming(
      1,
      {
        duration,
        easing: Easing.linear,
      },
      (finished) => {
        if (finished && onCompleteRef.current) {
        }
      }
    );
  }, [duration, progress, shouldReduceMotion]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = Math.round(circumference * (1 - progress.value));
    return {
      strokeDashoffset,
    };
  });

  return (
    <View style={[styles.container, { height: size, width: size }]}>
      <Svg height={size} width={size}>
        <Circle
          cx={center}
          cy={center}
          fill="none"
          r={radius}
          stroke={colors.border}
          strokeWidth={strokeWidth}
        />

        <AnimatedCircle
          animatedProps={animatedProps}
          cx={center}
          cy={center}
          fill="none"
          origin={`${center}, ${center}`}
          r={radius}
          stroke={colors.primary[500]}
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          rotation="-90"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
});
