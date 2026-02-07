/**
 * ConfettiBurst Component
 * Renders a burst of confetti particles emanating from a central point
 */

import React, { useMemo } from 'react';
import { View } from 'react-native';
import { styles } from '../QuickCompleteButton.styles';
import type { ConfettiBurstProps } from '../QuickCompleteButton.types';
import {
  CONFETTI_COLORS,
  PARTICLE_COUNT,
} from '../QuickCompleteButton.constants';
import { ConfettiParticle } from './ConfettiParticle';

interface ParticleConfig {
  angle: number;
  color: string;
  distance: number;
  size: number;
  index: number;
}

export function ConfettiBurst({ isActive }: ConfettiBurstProps) {
  const particles = useMemo<ParticleConfig[]>(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      angle: (i / PARTICLE_COUNT) * Math.PI * 2 + (Math.random() * 0.3 - 0.15),
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length] ?? '#10B981',
      distance: Math.round(40 + Math.random() * 30),
      index: i,
      size: Math.round(4 + Math.random() * 4),
    }));
  }, []);

  if (!isActive) return null;

  return (
    <View pointerEvents='none' style={styles.confettiContainer}>
      {particles.map((particle) => (
        <ConfettiParticle
          key={particle.index}
          angle={particle.angle}
          color={particle.color}
          distance={particle.distance}
          index={particle.index}
          isActive={isActive}
          size={particle.size}
        />
      ))}
    </View>
  );
}
