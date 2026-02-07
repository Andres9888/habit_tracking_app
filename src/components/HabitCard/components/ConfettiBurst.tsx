/**
 * ConfettiBurst Component
 * Displays celebratory confetti particles on habit completion
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { borderRadius } from '../../../theme/spacing';

const CONFETTI_COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];
const PARTICLE_COUNT = 8;

interface ConfettiBurstProps {
  active: boolean;
  onComplete: () => void;
}

interface ParticleProps {
  color: string;
  endX: number;
  endY: number;
  onComplete?: () => void;
}

function Particle({ color, endX, endY, onComplete }: ParticleProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  React.useEffect(() => {
    translateX.value = withSpring(endX, { damping: 15 });
    translateY.value = withSpring(endY, { damping: 15 });
    scale.value = withSequence(
      withSpring(1.5, { damping: 10 }),
      withTiming(0, { duration: 300 })
    );
    opacity.value = withTiming(0, { duration: 400 }, () => {
      if (onComplete) {
        runOnJS(onComplete)();
      }
    });
  }, [endX, endY, onComplete, opacity, scale, translateX, translateY]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View
      style={[styles.particle, { backgroundColor: color }, style]}
    />
  );
}

export function ConfettiBurst({ active, onComplete }: ConfettiBurstProps) {
  const particles = React.useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
      const distance = 40 + Math.random() * 20;

      return {
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        endX: Math.cos(angle) * distance,
        endY: Math.sin(angle) * distance,
        id: i,
      };
    });
  }, []);

  if (!active) return null;

  return (
    <View pointerEvents='none' style={styles.container}>
      {particles.map((particle) => (
        <Particle
          key={particle.id}
          color={particle.color}
          endX={particle.endX}
          endY={particle.endY}
          onComplete={particle.id === 0 ? onComplete : undefined}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  particle: {
    borderRadius: borderRadius.xs,
    height: 8,
    position: 'absolute',
    width: 8,
  },
});
