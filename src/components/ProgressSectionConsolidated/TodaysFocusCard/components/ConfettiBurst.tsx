/**
 * ConfettiBurst Component
 *
 * Renders a burst of confetti particles emanating from a central point.
 * Used for milestone celebrations in TodaysFocusCard.
 */

import React, { useMemo } from 'react';
import { View } from 'react-native';

import { ConfettiParticle } from './ConfettiParticle';
import { styles } from '../TodaysFocusCard.styles';
import {
  CONFETTI_COLORS,
  CONFETTI_PARTICLE_COUNT,
} from '../TodaysFocusCard.constants';

export interface ConfettiBurstProps {
  isActive: boolean;
}

export function ConfettiBurst({ isActive }: ConfettiBurstProps) {
  // Create particle configurations (stable across renders)
  // Round all values to avoid "Loss of precision during arithmetic conversion"
  const particles = useMemo(
    () =>
      Array.from({ length: CONFETTI_PARTICLE_COUNT }, (_, i) => ({
        angle:
          (i / CONFETTI_PARTICLE_COUNT) * Math.PI * 2 +
          (Math.random() * 0.3 - 0.15),
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        delay: i * 20, // Stagger particles slightly
        distance: Math.round(50 + Math.random() * 40),
        id: i,
        size: Math.round(5 + Math.random() * 5),
      })),
    []
  );

  if (!isActive) return null;

  return (
    <View pointerEvents='none' style={styles.confettiContainer}>
      {particles.map((particle) => (
        <ConfettiParticle
          key={particle.id}
          angle={particle.angle}
          color={particle.color}
          delay={particle.delay}
          distance={particle.distance}
          isActive={isActive}
          size={particle.size}
        />
      ))}
    </View>
  );
}

export default ConfettiBurst;
