/**
 * ConfettiParticle - Individual animated confetti particle
 * Separate component to comply with React's rules of hooks.
 */

import React, { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { styles } from '../QuickCompleteButton.styles';
import { springs } from '@/theme/animations';

const SPRING_CONFIG = springs.celebration;
const SCALE_SPRING = springs.pop;

interface ConfettiParticleProps {
  angle: number;
  color: string;
  distance: number;
  size: number;
  index: number;
  isActive: boolean;
}

export function ConfettiParticle({
  angle,
  color,
  distance,
  size,
  index,
  isActive,
}: ConfettiParticleProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      const delay = index * 15;
      const targetX = Math.round(Math.cos(angle) * distance);
      const targetY = Math.round(Math.sin(angle) * distance) - 20;

      translateX.value = 0;
      translateY.value = 0;
      scale.value = 0;
      opacity.value = 0;

      translateX.value = withDelay(delay, withSpring(targetX, SPRING_CONFIG));
      translateY.value = withDelay(delay, withSpring(targetY, SPRING_CONFIG));

      scale.value = withDelay(
        delay,
        withSequence(
          withSpring(1.2, SCALE_SPRING),
          withTiming(0, { duration: 400, easing: Easing.out(Easing.ease) })
        )
      );

      opacity.value = withDelay(
        delay,
        withSequence(
          withTiming(1, { duration: 50 }),
          withDelay(
            200,
            withTiming(0, { duration: 300, easing: Easing.out(Easing.ease) })
          )
        )
      );
    }
  }, [
    isActive,
    angle,
    distance,
    index,
    opacity,
    scale,
    translateX,
    translateY,
  ]);

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: opacity.value ?? 0,
      transform: [
        { translateX: translateX.value ?? 0 },
        { translateY: translateY.value ?? 0 },
        { scale: scale.value ?? 0 },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.confettiParticle,
        {
          backgroundColor: color,
          borderRadius: size / 2,
          height: size,
          width: size,
        },
        animatedStyle,
      ]}
    />
  );
}
