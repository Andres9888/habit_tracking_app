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

import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { PARTICLE_BURST } from './animations';
import { Particle } from './Particle';

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
    <View pointerEvents='none' style={styles.container}>
      {particles.map((particle, index) => (
        <Particle
          key={index}
          angle={particle.angle}
          color={particle.color}
          delay={particle.delay}
          distance={distance}
          duration={duration}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
  },
});
