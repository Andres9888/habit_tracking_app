/**
 * useConfettiParticles Hook
 * Creates and manages confetti particle animations
 */

import { useEffect } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import {
  CONFETTI_COLORS,
  PARTICLE_COUNT,
} from '../QuickCompleteButton.constants';

const SPRING_CONFIG = { damping: 12, mass: 1, stiffness: 200 };

export function useConfettiParticles(isActive: boolean) {
  const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    angle: (i / PARTICLE_COUNT) * Math.PI * 2 + (Math.random() * 0.3 - 0.15),

    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],

    distance: Math.round(40 + Math.random() * 30),

    // eslint-disable-next-line react-hooks/rules-of-hooks
    opacity: useSharedValue(0),

    // eslint-disable-next-line react-hooks/rules-of-hooks
    scale: useSharedValue(0),

    size: Math.round(4 + Math.random() * 4),

    // eslint-disable-next-line react-hooks/rules-of-hooks
    translateX: useSharedValue(0),
    // eslint-disable-next-line react-hooks/rules-of-hooks
    translateY: useSharedValue(0),
  }));

  useEffect(() => {
    if (!isActive) return;
    for (const [i, p] of particles.entries()) {
      const delay = i * 15;
      const targetX = Math.round(Math.cos(p.angle) * p.distance);
      const targetY = Math.round(Math.sin(p.angle) * p.distance) - 20;

      p.translateX.value = 0;
      p.translateY.value = 0;
      p.scale.value = 0;
      p.opacity.value = 0;

      p.translateX.value = withDelay(delay, withSpring(targetX, SPRING_CONFIG));
      p.translateY.value = withDelay(delay, withSpring(targetY, SPRING_CONFIG));
      p.scale.value = withDelay(
        delay,
        withSequence(
          withSpring(1.2, { damping: 8, stiffness: 300 }),
          withTiming(0, { duration: 400, easing: Easing.out(Easing.ease) })
        )
      );
      p.opacity.value = withDelay(
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
  }, [isActive]);

  const particleStyles = particles.map((p) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useAnimatedStyle(() => ({
      opacity: p.opacity.value,
      transform: [
        { translateX: p.translateX.value },
        { translateY: p.translateY.value },
        { scale: p.scale.value },
      ],
    }))
  );

  return { particles, particleStyles };
}
