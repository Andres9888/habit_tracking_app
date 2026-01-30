/**
 * ConfettiBurst Component
 * Renders a burst of confetti particles emanating from a central point
 *
 * Refactored to properly follow React's rules of hooks by using
 * a separate ConfettiParticle component for each particle.
 */

import React, { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { styles } from '../QuickCompleteButton.styles';
import type { ConfettiBurstProps } from '../QuickCompleteButton.types';
import { CONFETTI_COLORS, PARTICLE_COUNT } from '../QuickCompleteButton.constants';

interface ParticleConfig {
  angle: number;
  color: string;
  distance: number;
  size: number;
  index: number;
}

const SPRING_CONFIG = { damping: 12, mass: 1, stiffness: 200 };
const SCALE_SPRING = { damping: 8, stiffness: 300 };

/**
 * Individual confetti particle with its own animation state.
 * Each particle is a separate component to comply with React's rules of hooks.
 */
function ConfettiParticle({
  angle,
  color,
  distance,
  size,
  index,
  isActive,
}: ParticleConfig & { isActive: boolean }) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      const delay = index * 15;
      const targetX = Math.round(Math.cos(angle) * distance);
      const targetY = Math.round(Math.sin(angle) * distance) - 20;

      // Reset values
      translateX.value = 0;
      translateY.value = 0;
      scale.value = 0;
      opacity.value = 0;

      // Animate position
      translateX.value = withDelay(delay, withSpring(targetX, SPRING_CONFIG));
      translateY.value = withDelay(delay, withSpring(targetY, SPRING_CONFIG));

      // Animate scale: grow then shrink
      scale.value = withDelay(
        delay,
        withSequence(
          withSpring(1.2, SCALE_SPRING),
          withTiming(0, { duration: 400, easing: Easing.out(Easing.ease) })
        )
      );

      // Animate opacity: fade in then out
      opacity.value = withDelay(
        delay,
        withSequence(
          withTiming(1, { duration: 50 }),
          withDelay(
            200,
            withTiming(0, { duration: 300, easing: Easing.out(Easing.ease) })
          )
        )
      );
    }
  }, [isActive, angle, distance, index, opacity, scale, translateX, translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: opacity.value ?? 0,
      transform: [
        { translateX: translateX.value ?? 0 },
        { translateY: translateY.value ?? 0 },
        { scale: scale.value ?? 0 },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.confettiParticle,
        {
          backgroundColor: color,
          borderRadius: size / 2,
          height: size,
          width: size,
        },
        animatedStyle,
      ]}
    />
  );
}

export function ConfettiBurst({ isActive }: ConfettiBurstProps) {
  // Generate particle configs once (stable across renders)
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
