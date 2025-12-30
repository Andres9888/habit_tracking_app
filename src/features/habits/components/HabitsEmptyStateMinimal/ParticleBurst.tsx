/**
 * ParticleBurst - Radial particle explosion effect for success state
 *
 * Features:
 * - 8 circular particles in radial pattern (45° apart)
 * - Each particle bursts outward with scale and opacity animation
 * - Staggered delays for natural feel
 * - Respects reduced motion preference (no particles rendered)
 * - Uses reanimated for smooth 60fps animation
 */

import { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { PARTICLE_BURST } from './animations';

const PARTICLE_SIZE = 8;

export interface ParticleBurstProps {
  /** Duration of each particle animation in ms (default: 800ms) */
  duration?: number;
  /** Distance particles travel outward in px (default: 60px) */
  distance?: number;
}

interface ParticleConfig {
  angle: number; // Angle in radians
  color: string;
  delay: number; // Stagger delay in ms
}

/**
 * ParticleBurst - Celebratory explosion when habit is created
 *
 * Triggers immediately on mount with 8 particles bursting outward
 * from the center in a radial pattern. Each particle scales up,
 * moves outward, fades out, and scales down.
 */
export function ParticleBurst({
  duration = PARTICLE_BURST.duration,
  distance = PARTICLE_BURST.distance,
}: ParticleBurstProps) {
  const shouldReduceMotion = useReducedMotion();

  // Generate particle configurations
  const particles = useMemo<ParticleConfig[]>(() => {
    const configs: ParticleConfig[] = [];
    const { count, colors, staggerDelay } = PARTICLE_BURST;

    for (let i = 0; i < count; i++) {
      // 45° apart starting from 0° (right), converted to radians
      const angle = (i * 45 * Math.PI) / 180;
      // Cycle through colors
      const color = colors[i % colors.length];
      // Staggered delay
      const delay = i * staggerDelay;

      configs.push({ angle, color, delay });
    }

    return configs;
  }, []);

  // Don't render anything if reduced motion is preferred
  if (shouldReduceMotion) {
    return null;
  }

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((particle, index) => (
        <Particle
          key={index}
          angle={particle.angle}
          color={particle.color}
          delay={particle.delay}
          duration={duration}
          distance={distance}
        />
      ))}
    </View>
  );
}

interface ParticleProps {
  angle: number;
  color: string;
  delay: number;
  duration: number;
  distance: number;
}

function Particle({ angle, color, delay, duration, distance }: ParticleProps) {
  // Animated progress value (0 to 1)
  const progress = useSharedValue(0);

  useEffect(() => {
    // Start animation with stagger delay
    progress.value = withDelay(
      delay,
      withTiming(1, {
        duration,
        easing: Easing.out(Easing.cubic),
      })
    );
  }, [delay, duration, progress]);

  // Calculate X and Y translation based on angle
  // Round to avoid "Loss of precision during arithmetic conversion" error
  const translateX = Math.round(Math.cos(angle) * distance);
  const translateY = Math.round(Math.sin(angle) * distance);

  const animatedStyle = useAnimatedStyle(() => {
    const p = progress.value;

    // Scale: 0 → 1 at 30% → 0.5 at 100%
    const scale = interpolate(p, [0, 0.3, 1], [0, 1, 0.5]);

    // Opacity: 1 at peak → 0 at end
    const opacity = interpolate(p, [0, 0.3, 1], [0, 1, 0]);

    // Position: move outward over time
    const currentTranslateX = interpolate(p, [0, 1], [0, translateX]);
    const currentTranslateY = interpolate(p, [0, 1], [0, translateY]);

    return {
      opacity,
      transform: [
        { translateX: currentTranslateX },
        { translateY: currentTranslateY },
        { scale },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        { backgroundColor: color },
        animatedStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  particle: {
    position: 'absolute',
    width: PARTICLE_SIZE,
    height: PARTICLE_SIZE,
    borderRadius: PARTICLE_SIZE / 2,
  },
});
