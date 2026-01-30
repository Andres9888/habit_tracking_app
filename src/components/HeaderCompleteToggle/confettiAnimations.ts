/**
 * Confetti animation helpers
 */

import {
  withSequence,
  withSpring,
  withTiming,
  withDelay,
  Easing,
  type SharedValue,
} from 'react-native-reanimated';

interface ParticleAnimationValues {
  opacity: SharedValue<number>;
  scale: SharedValue<number>;
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  angle: number;
  distance: number;
}

const SPRING_CONFIG = { damping: 12, mass: 1, stiffness: 200 };
const SCALE_SPRING = { damping: 8, stiffness: 300 };

export function animateParticle(
  particle: ParticleAnimationValues,
  index: number
): void {
  const delay = index * 10;
  const targetX = Math.round(Math.cos(particle.angle) * particle.distance);
  const targetY = Math.round(Math.sin(particle.angle) * particle.distance) - 15;

  // Reset values
  particle.translateX.value = 0;
  particle.translateY.value = 0;
  particle.scale.value = 0;
  particle.opacity.value = 0;

  // Animate position
  particle.translateX.value = withDelay(
    delay,
    withSpring(targetX, SPRING_CONFIG)
  );
  particle.translateY.value = withDelay(
    delay,
    withSpring(targetY, SPRING_CONFIG)
  );

  // Animate scale: grow then shrink
  particle.scale.value = withDelay(
    delay,
    withSequence(
      withSpring(1.2, SCALE_SPRING),
      withTiming(0, { duration: 300, easing: Easing.out(Easing.ease) })
    )
  );

  // Animate opacity: fade in then out
  particle.opacity.value = withDelay(
    delay,
    withSequence(
      withTiming(1, { duration: 50 }),
      withDelay(
        150,
        withTiming(0, { duration: 250, easing: Easing.out(Easing.ease) })
      )
    )
  );
}
