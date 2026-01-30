/**
 * ConfettiBurst Component
 * Renders a burst of confetti particles emanating from a central point
 */

import React from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { styles } from '../QuickCompleteButton.styles';
import type { ConfettiBurstProps } from '../QuickCompleteButton.types';
import { useConfettiParticles } from './useConfettiParticles';

export function ConfettiBurst({ isActive }: ConfettiBurstProps) {
  const { particles, particleStyles } = useConfettiParticles(isActive);

  if (!isActive) return null;

  return (
    <View pointerEvents='none' style={styles.confettiContainer}>
      {particles.map((particle, i) => (
        <Animated.View
          key={i}
          style={[
            styles.confettiParticle,
            {
              backgroundColor: particle.color,
              borderRadius: particle.size / 2,
              height: particle.size,
              width: particle.size,
            },
            particleStyles[i],
          ]}
        />
      ))}
    </View>
  );
}
