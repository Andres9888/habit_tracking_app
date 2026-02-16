/**
 * FloatingXPText Component
 *
 * Displays "+X XP" text that floats up and fades out with spring physics.
 * Used when user completes a habit or earns bonus XP.
 *
 * Animation: spring-driven float (60px), scale pop 1→1.3→1→0.8, fade out
 * Duration: ~900ms total
 */

import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { useReduceMotion } from '../../hooks/useReduceMotion';

export interface FloatingXPTextProps {
  /** XP value to display (e.g., 10, 50, 100) */
  value: number;

  /** Position where animation starts */
  startPosition: { x: number; y: number };

  /** Callback when animation completes */
  onComplete?: () => void;

  /** Show coin icon instead of XP */
  showCoin?: boolean;
}

export function FloatingXPText({
  value,
  startPosition,
  onComplete,
  showCoin = false,
}: FloatingXPTextProps) {
  const reduceMotion = useReduceMotion();
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    // Pop in: scale from 0.5 → 1.3 → 1.0 with spring
    scale.value = withSequence(
      withSpring(1.3, { damping: 12, stiffness: 300 }),
      withSpring(1.0, { damping: 14, stiffness: 200 }),
    );

    // Fade in quickly
    opacity.value = withTiming(1, { duration: 120 });

    // Float upward with spring physics (overshoots slightly for organic feel)
    translateY.value = withSpring(-60, {
      damping: 18,
      stiffness: 80,
      mass: 0.8,
    });

    // After holding visible, fade out and shrink
    opacity.value = withDelay(
      500,
      withTiming(0, { duration: 400 }, (finished) => {
        if (finished && onComplete) {
          runOnJS(onComplete)();
        }
      }),
    );

    scale.value = withDelay(
      500,
      withSpring(0.6, { damping: 18, stiffness: 150 }),
    );
  }, [onComplete, opacity, scale, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View
      pointerEvents='none'
      style={[
        styles.container,
        {
          left: startPosition.x,
          position: 'absolute',
          top: startPosition.y,
        },
        animatedStyle,
      ]}
    >
      {showCoin ? (
        <Animated.Text style={styles.coinText}>+{value} 🪙</Animated.Text>
      ) : (
        <Animated.Text style={styles.xpText}>+{value} XP</Animated.Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  coinText: {
    color: '#F59E0B',
    fontSize: 18,
    fontWeight: '700',
    textShadowColor: 'rgba(245, 158, 11, 0.5)',
    textShadowOffset: { height: 0, width: 0 },
    textShadowRadius: 12,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  xpText: {
    color: '#047857',
    fontSize: 18,
    fontWeight: '700',
    textShadowColor: 'rgba(16, 185, 129, 0.5)',
    textShadowOffset: { height: 0, width: 0 },
    textShadowRadius: 12,
  },
});

export default FloatingXPText;
