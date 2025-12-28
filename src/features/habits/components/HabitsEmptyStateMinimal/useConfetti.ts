/**
 * useConfetti - Confetti burst animation hook
 *
 * Creates and manages confetti particles with multiple shapes and physics-based animation.
 *
 * Features:
 * - Weighted shape distribution (circle 30%, star 20%, heart 15%, sparkle 20%, ribbon 15%)
 * - Randomized colors from celebration palette
 * - Physics: burst up, drift sideways, fall with gravity
 * - Staggered particle start times
 * - Automatic cleanup after animation
 * - Reduced motion support
 */

import { useCallback, useMemo, useState } from 'react';
import {
  Easing,
  SharedValue,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { CONFETTI_CONFIG } from './animations';
import type { ConfettiShape } from './types';

/**
 * Particle data structure for rendering
 */
export interface ConfettiParticleData {
  /** Unique identifier */
  id: number;
  /** Shape type for this particle */
  shape: ConfettiShape;
  /** Color from celebration palette */
  color: string;
  /** Size multiplier (0.8 - 1.2) */
  sizeFactor: number;
  /** Stagger delay in ms */
  delay: number;
  /** Starting X position (centered at 0) */
  startX: number;
  /** Horizontal drift direction and magnitude */
  driftX: number;
}

/**
 * Animation values for a single particle
 */
export interface ParticleAnimationValues {
  translateY: SharedValue<number>;
  translateX: SharedValue<number>;
  opacity: SharedValue<number>;
  rotation: SharedValue<number>;
  scale: SharedValue<number>;
}

/**
 * Selects a shape based on weighted random distribution
 */
function selectWeightedShape(): ConfettiShape {
  const random = Math.random();
  let cumulative = 0;

  for (const shape of CONFETTI_CONFIG.shapes) {
    cumulative += CONFETTI_CONFIG.shapeWeights[shape];
    if (random < cumulative) {
      return shape;
    }
  }

  // Fallback (should never reach)
  return 'circle';
}

/**
 * Generates random value between min and max
 */
function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Creates particle data for the confetti burst
 */
function createParticles(count: number): ConfettiParticleData[] {
  return Array.from({ length: count }, (_, index) => ({
    color: CONFETTI_CONFIG.colors[index % CONFETTI_CONFIG.colors.length],
    delay: randomInRange(0, CONFETTI_CONFIG.staggerMax),
    // Random horizontal start
    driftX: randomInRange(
      CONFETTI_CONFIG.driftRange.min,
      CONFETTI_CONFIG.driftRange.max
    ),

    id: index,

    shape: selectWeightedShape(),

    sizeFactor: randomInRange(
      CONFETTI_CONFIG.sizeRange.min,
      CONFETTI_CONFIG.sizeRange.max
    ),
    startX: randomInRange(-100, 100),
  }));
}

/**
 * Hook for managing confetti animation state and particles
 */
export function useConfetti() {
  const shouldReduceMotion = useReducedMotion();
  const [isActive, setIsActive] = useState(false);
  const [particles, setParticles] = useState<ConfettiParticleData[]>([]);

  // Shared animation values for all particles
  // We use one set of base values and each particle applies its own offsets
  const animationProgress = useSharedValue(0);

  /**
   * Triggers the confetti burst animation
   */
  const triggerConfetti = useCallback(() => {
    if (shouldReduceMotion) return;

    // Generate new particles
    const newParticles = createParticles(CONFETTI_CONFIG.particleCount);
    setParticles(newParticles);
    setIsActive(true);

    // Reset and start animation
    animationProgress.value = 0;
    animationProgress.value = withTiming(1, {
      duration: CONFETTI_CONFIG.baseDuration + CONFETTI_CONFIG.staggerMax,
      easing: Easing.out(Easing.ease),
    });

    // Cleanup after animation completes
    setTimeout(
      () => {
        setIsActive(false);
        setParticles([]);
      },
      CONFETTI_CONFIG.baseDuration + CONFETTI_CONFIG.staggerMax + 100
    );
  }, [animationProgress, shouldReduceMotion]);

  /**
   * Clears all particles immediately
   */
  const clearConfetti = useCallback(() => {
    setIsActive(false);
    setParticles([]);
    animationProgress.value = 0;
  }, [animationProgress]);

  return {
    /** Animation progress (0 to 1) */
    animationProgress,

    /** Clear confetti immediately */
    clearConfetti,

    /** Whether confetti is currently animating */
    isActive,

    /** Particle data for rendering */
    particles,

    /** Whether user prefers reduced motion */
    shouldReduceMotion,

    /** Trigger the confetti burst */
    triggerConfetti,
  };
}

/**
 * Hook to create animated styles for a single particle
 * Uses particle-specific values to calculate position, rotation, etc.
 */
export function useParticleAnimation(particle: ConfettiParticleData) {
  const shouldReduceMotion = useReducedMotion();

  // Individual shared values for this particle
  const translateY = useSharedValue(50); // Start below center
  const translateX = useSharedValue(particle.startX);
  const opacity = useSharedValue(shouldReduceMotion ? 0 : 1);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  /**
   * Starts the particle animation
   */
  const startAnimation = useCallback(() => {
    if (shouldReduceMotion) {
      opacity.value = 0;
      return;
    }

    const duration = CONFETTI_CONFIG.baseDuration;
    const delay = particle.delay;

    // Burst up then fall with gravity effect
    translateY.value = withDelay(
      delay,
      withSequence(
        // Quick burst upward
        withTiming(-150, {
          duration: duration * 0.3,
          easing: Easing.out(Easing.cubic),
        }),
        // Fall down with easing (simulates gravity)
        withTiming(400, {
          duration: duration * 0.7,
          easing: Easing.in(Easing.quad),
        })
      )
    );

    // Drift sideways
    translateX.value = withDelay(
      delay,
      withTiming(particle.startX + particle.driftX, {
        duration: duration,
        easing: Easing.out(Easing.ease),
      })
    );

    // Fade out in the last 40%
    opacity.value = withDelay(
      delay + duration * 0.6,
      withTiming(0, {
        duration: duration * 0.4,
        easing: Easing.in(Easing.ease),
      })
    );

    // Continuous rotation
    const targetRotation =
      (Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 360);
    rotation.value = withDelay(
      delay,
      withTiming(targetRotation, {
        duration: duration,
        easing: Easing.out(Easing.ease),
      })
    );

    // Slight scale down as it falls
    scale.value = withDelay(
      delay + duration * 0.5,
      withTiming(0.6, {
        duration: duration * 0.5,
        easing: Easing.in(Easing.ease),
      })
    );
  }, [
    particle.delay,
    particle.driftX,
    particle.startX,
    opacity,
    rotation,
    scale,
    shouldReduceMotion,
    translateX,
    translateY,
  ]);

  return {
    opacity,
    rotation,
    scale,
    startAnimation,
    translateX,
    translateY,
  };
}

export { type ConfettiShape } from './types';
