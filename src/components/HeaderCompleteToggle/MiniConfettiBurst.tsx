/**
 * Mini ConfettiBurst component for header toggle
 *
 * Renders a burst of confetti particles using the extracted ConfettiParticle.
 */

import React, { useMemo } from 'react';
import { View } from 'react-native';
import { CONFETTI_COLORS, PARTICLE_COUNT } from './constants';
import { styles } from './styles';
import { ConfettiParticle } from './ConfettiParticle';

interface MiniConfettiBurstProps {
  isActive: boolean;
}

interface ParticleConfig {
  angle: number;
  color: string;
  distance: number;
  size: number;
  index: number;
}

export function MiniConfettiBurst({ isActive }: MiniConfettiBurstProps) {
  const particles = useMemo<ParticleConfig[]>(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      angle: (i / PARTICLE_COUNT) * Math.PI * 2 + (Math.random() * 0.3 - 0.15),
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length] ?? '#10B981',
      distance: Math.round(25 + Math.random() * 20),
      index: i,
      size: Math.round(3 + Math.random() * 3),
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
