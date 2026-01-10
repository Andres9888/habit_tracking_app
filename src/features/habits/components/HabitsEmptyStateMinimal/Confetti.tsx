/**
 * Confetti - Animated confetti burst container
 *
 * Renders multiple ConfettiParticle components with randomized
 * timing and colors. Skips rendering when reduced motion is preferred.
 */

import { View } from 'react-native';

import { CONFETTI_CONFIG } from './animations';
import { ConfettiParticle } from './ConfettiParticle';

interface ConfettiProps {
  shouldReduceMotion: boolean;
}

export function Confetti({ shouldReduceMotion }: ConfettiProps) {
  // Skip rendering particles entirely when reduced motion is preferred
  if (shouldReduceMotion) return null;

  const particles = Array.from(
    { length: CONFETTI_CONFIG.particleCount },
    (_, i) => ({
      color: CONFETTI_CONFIG.colors[i % CONFETTI_CONFIG.colors.length],
      delay: Math.random() * 300,
      id: i,
    })
  );

  return (
    <View
      pointerEvents='none'
      style={{
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        left: 0,
        overflow: 'hidden',
        position: 'absolute',
        right: 0,
        top: 0,
      }}
    >
      {particles.map((particle) => (
        <ConfettiParticle
          key={particle.id}
          color={particle.color}
          delay={particle.delay}
          shouldReduceMotion={shouldReduceMotion}
        />
      ))}
    </View>
  );
}
