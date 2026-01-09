/**
 * ConfettiParticle - Individual animated confetti piece
 *
 * Floats upward with random drift, rotation, and fade-out.
 * Respects reduced motion preferences.
 */

import Animated from 'react-native-reanimated';

import { useConfettiParticleAnimation } from './useConfettiParticleAnimation';

interface ConfettiParticleProps {
  delay: number;
  color: string;
  shouldReduceMotion: boolean;
}

export function ConfettiParticle({
  delay,
  color,
  shouldReduceMotion,
}: ConfettiParticleProps) {
  const { particleStyle } = useConfettiParticleAnimation({
    delay,
    shouldReduceMotion,
  });

  return (
    <Animated.View
      style={[
        particleStyle,
        {
          backgroundColor: color,
          borderRadius: 4,
          height: 8,
          position: 'absolute',
          width: 8,
        },
      ]}
    />
  );
}
