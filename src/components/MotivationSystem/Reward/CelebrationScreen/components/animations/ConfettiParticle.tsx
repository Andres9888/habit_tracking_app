/**
 * ConfettiParticle - Individual confetti particle with physics-based animation
 */

import React, { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

import type { ConfettiParticleProps } from '../types';

export function ConfettiParticle({
  color,
  delay,
  angle,
  reduceMotion,
}: ConfettiParticleProps) {
  const progress = useSharedValue(0);
  // Round all values to avoid "Loss of precision during arithmetic conversion" error
  const distance = Math.round(100 + Math.random() * 60);
  const rotation = Math.round(Math.random() * 720);
  const size = Math.round(6 + Math.random() * 6);

  useEffect(() => {
    if (reduceMotion) return;

    progress.value = withDelay(delay, withTiming(1, { duration: 1200 }));
  }, [delay, reduceMotion, progress]);

  // Round to avoid precision errors in Reanimated's native layer
  const translateX = Math.round(Math.cos(angle) * distance);
  const translateY = Math.round(Math.sin(angle) * distance) - 50; // Bias upward

  const animatedStyle = useAnimatedStyle(() => {
    const p = progress.value;
    const currentX = interpolate(
      p,
      [0, 1],
      [0, translateX],
      Extrapolation.CLAMP
    );
    const currentY = interpolate(
      p,
      [0, 0.3, 1],
      [0, translateY * 0.3, translateY + 100],
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      p,
      [0, 0.2, 0.8, 1],
      [0, 1.2, 1, 0.3],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      p,
      [0, 0.2, 0.8, 1],
      [0, 1, 1, 0],
      Extrapolation.CLAMP
    );
    const rotate = interpolate(p, [0, 1], [0, rotation], Extrapolation.CLAMP);

    return {
      opacity,
      transform: [
        { translateX: currentX },
        { translateY: currentY },
        { scale },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  if (reduceMotion) return null;

  return (
    <Animated.View
      style={[
        {
          backgroundColor: color,
          borderRadius: size / 2,
          height: size,
          position: 'absolute',
          width: size,
        },
        animatedStyle,
      ]}
    />
  );
}
