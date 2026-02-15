/**
 * useConfettiParticleAnimation - Animation hook for confetti particles
 *
 * Manages the floating, spinning, and fading animation for confetti.
 */

import { useEffect } from 'react';

import {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { CONFETTI_CONFIG } from './animations';

interface UseConfettiParticleAnimationParams {
  delay: number;
  shouldReduceMotion: boolean;
}

export function useConfettiParticleAnimation({
  delay,
  shouldReduceMotion,
}: UseConfettiParticleAnimationParams) {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(shouldReduceMotion ? 0 : 1);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (shouldReduceMotion) {
      opacity.value = 0;
      return;
    }

    const drift = Math.round((Math.random() - 0.5) * 100);
    const startX = Math.round((Math.random() - 0.5) * 200);

    translateX.value = startX;
    translateY.value = 50;

    translateY.value = withDelay(
      delay,
      withTiming(-300, {
        duration: CONFETTI_CONFIG.duration,
        easing: Easing.out(Easing.quad),
      })
    );
    translateX.value = withDelay(
      delay,
      withTiming(startX + drift, { duration: CONFETTI_CONFIG.duration })
    );
    opacity.value = withDelay(
      delay,
      withTiming(0, {
        duration: CONFETTI_CONFIG.duration,
        easing: Easing.in(Easing.ease),
      })
    );
    rotation.value = withDelay(
      delay,
      withTiming(Math.round(Math.random() * 360), {
        duration: CONFETTI_CONFIG.duration,
      })
    );
    scale.value = withDelay(
      delay + 200,
      withTiming(0.5, { duration: CONFETTI_CONFIG.duration - 200 })
    );
  }, [
    delay,
    opacity,
    rotation,
    scale,
    shouldReduceMotion,
    translateX,
    translateY,
  ]);

  const particleStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${Math.round(rotation.value)}deg` },
      { scale: scale.value },
    ],
  }));

  return { particleStyle };
}
