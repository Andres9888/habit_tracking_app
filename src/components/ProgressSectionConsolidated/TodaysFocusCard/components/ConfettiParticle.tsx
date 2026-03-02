/**
 * ConfettiParticle Component
 *
 * A single confetti particle with its own animated values.
 * Used by ConfettiBurst to create the celebration effect.
 */

import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';

import { styles } from '../TodaysFocusCard.styles';
import { springs } from '@/theme/animations';

export interface ConfettiParticleProps {
  angle: number;
  color: string;
  delay: number;
  distance: number;
  isActive: boolean;
  size: number;
}

export const ConfettiParticle = React.memo(function ConfettiParticle({
  angle,
  color,
  delay,
  distance,
  isActive,
  size,
}: ConfettiParticleProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      // Round to avoid "Loss of precision during arithmetic conversion" error
      const targetX = Math.round(Math.cos(angle) * distance);
      const targetY = Math.round(Math.sin(angle) * distance) - 30; // Bias upward

      // Reset to center
      translateX.value = 0;
      translateY.value = 0;
      scale.value = 0;
      opacity.value = 0;

      // Animate outward with spring physics
      translateX.value = withDelay(
        delay,
        withSpring(targetX, springs.celebration)
      );
      translateY.value = withDelay(
        delay,
        withSpring(targetY, springs.celebration)
      );
      scale.value = withDelay(
        delay,
        withSequence(
          withSpring(1.3, springs.pop),
          withTiming(0, { duration: 400, easing: Easing.out(Easing.ease) })
        )
      );
      opacity.value = withDelay(
        delay,
        withSequence(
          withTiming(1, { duration: 50 }),
          withDelay(
            250,
            withTiming(0, { duration: 350, easing: Easing.out(Easing.ease) })
          )
        )
      );
    }
  }, [
    isActive,
    angle,
    delay,
    distance,
    opacity,
    scale,
    translateX,
    translateY,
  ]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

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
});

export default ConfettiParticle;
