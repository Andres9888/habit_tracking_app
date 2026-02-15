/**
 * Particle - Individual radial particle for burst effect
 */

import { StyleSheet } from 'react-native';
import { useEffect } from 'react';

import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

const PARTICLE_SIZE = 8;

interface ParticleProps {
  angle: number;
  color: string;
  delay: number;
  duration: number;
  distance: number;
}

export function Particle({
  angle,
  color,
  delay,
  duration,
  distance,
}: ParticleProps) {
  // Animated progress value (0 to 1)
  const progress = useSharedValue(0);

  useEffect(() => {
    // Start animation with stagger delay
    progress.value = withDelay(
      delay,
      withTiming(1, {
        duration,
        easing: Easing.out(Easing.cubic),
      })
    );
  }, [delay, duration, progress]);

  // Calculate X and Y translation based on angle
  // Round to avoid "Loss of precision during arithmetic conversion" error
  const translateX = Math.round(Math.cos(angle) * distance);
  const translateY = Math.round(Math.sin(angle) * distance);

  const animatedStyle = useAnimatedStyle(() => {
    const animationProgress = progress.value;

    // Scale: 0 → 1 at 30% → 0.5 at 100%
    const scale = interpolate(animationProgress, [0, 0.3, 1], [0, 1, 0.5]);

    // Opacity: 1 at peak → 0 at end
    const opacity = interpolate(animationProgress, [0, 0.3, 1], [0, 1, 0]);

    // Position: move outward over time
    const currentTranslateX = interpolate(animationProgress, [0, 1], [0, translateX]);
    const currentTranslateY = interpolate(animationProgress, [0, 1], [0, translateY]);

    return {
      opacity,
      transform: [
        { translateX: currentTranslateX },
        { translateY: currentTranslateY },
        { scale },
      ],
    };
  });

  return (
    <Animated.View
      style={[styles.particle, { backgroundColor: color }, animatedStyle]}
    />
  );
}

const styles = StyleSheet.create({
  particle: {
    borderRadius: PARTICLE_SIZE / 2,
    height: PARTICLE_SIZE,
    position: 'absolute',
    width: PARTICLE_SIZE,
  },
});
