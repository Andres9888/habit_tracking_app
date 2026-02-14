/**
 * FullScreenConfetti - Animated confetti particles that burst across the screen
 */

import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  Easing,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CONFETTI_COLORS = [
  '#047857', // primary green
  '#059669', // button green
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // purple
  '#3B82F6', // blue
  '#EC4899', // pink
  '#F97316', // orange
];

const PARTICLE_COUNT = 40;

interface ParticleConfig {
  id: number;
  color: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  rotation: number;
  delay: number;
  size: number;
  shape: 'square' | 'circle' | 'rectangle';
}

function ConfettiParticle({ config }: { config: ParticleConfig }) {
  const translateX = useSharedValue(config.startX);
  const translateY = useSharedValue(config.startY);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  React.useEffect(() => {
    opacity.value = withDelay(config.delay, withTiming(1, { duration: 100 }));
    scale.value = withDelay(
      config.delay,
      withSpring(1, { damping: 12, stiffness: 200 })
    );
    translateX.value = withDelay(
      config.delay,
      withSpring(config.endX, { damping: 15, stiffness: 80 })
    );
    translateY.value = withDelay(
      config.delay,
      withSpring(config.endY, { damping: 8, stiffness: 60 })
    );
    rotate.value = withDelay(
      config.delay,
      withTiming(config.rotation, { duration: 1500, easing: Easing.out(Easing.quad) })
    );

    // Fade out
    opacity.value = withDelay(
      config.delay + 1200,
      withTiming(0, { duration: 500 })
    );
  }, [config, opacity, scale, translateX, translateY, rotate]);

  const style = useAnimatedStyle(() => ({
    backgroundColor: config.color,
    borderRadius: config.shape === 'circle' ? config.size / 2 : 2,
    height: config.shape === 'rectangle' ? config.size * 0.4 : config.size,
    opacity: opacity.value,
    position: 'absolute' as const,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
    width: config.size,
  }));

  return <Animated.View style={style} />;
}

export function FullScreenConfetti() {
  const particles = useMemo<ParticleConfig[]>(() => {
    const centerX = SCREEN_WIDTH / 2;
    const centerY = SCREEN_HEIGHT * 0.35;

    return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const distance = 100 + Math.random() * (SCREEN_WIDTH * 0.6);
      const shapes: Array<'square' | 'circle' | 'rectangle'> = ['square', 'circle', 'rectangle'];

      return {
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        delay: Math.random() * 300,
        endX: centerX + Math.cos(angle) * distance - 4,
        endY: centerY + Math.sin(angle) * distance * 1.3 + Math.random() * 100,
        id: i,
        rotation: (Math.random() - 0.5) * 720,
        shape: shapes[i % 3],
        size: 6 + Math.random() * 8,
        startX: centerX - 4,
        startY: centerY,
      };
    });
  }, []);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {particles.map((config) => (
        <ConfettiParticle key={config.id} config={config} />
      ))}
    </View>
  );
}

export default FullScreenConfetti;
