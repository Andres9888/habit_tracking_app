/**
 * Enhanced Confetti Particle
 *
 * Individual confetti piece with physics-based animation.
 * Supports gravity, wind, drag, and rotation.
 */

import { memo } from 'react';
import Animated from 'react-native-reanimated';

import type { ParticleState } from './types';

interface ConfettiParticleProps {
  /** Particle state from physics engine */
  state: ParticleState;

  /** Particle color */
  color: string;

  /** Particle size */
  size?: number;

  /** Particle shape (0 = square, 1 = circle, 2 = triangle) */
  shape?: 0 | 1 | 2;
}

/**
 * ConfettiParticle - Individual particle component
 *
 * Renders a single confetti piece with physics-based transformation.
 * Uses React Native Reanimated for smooth 60fps animations.
 */
export const ConfettiParticle = memo<ConfettiParticleProps>(
  ({ state, color, size = 8, shape = 0 }) => {
    const animatedStyle = {
      transform: [
        { translateX: state.x },
        { translateY: state.y },
        { rotate: `${state.rotation}deg` },
        { scale: state.scale },
      ],
      opacity: state.opacity,
    };

    // Different shapes based on shape prop
    const shapeStyle = shape === 1 ? { borderRadius: size / 2 } : {};

    return (
      <Animated.View
        style={[
          animatedStyle,
          shapeStyle,
          {
            backgroundColor: color,
            height: size,
            position: 'absolute',
            width: size,
          },
        ]}
      />
    );
  }
);

ConfettiParticle.displayName = 'ConfettiParticle';
