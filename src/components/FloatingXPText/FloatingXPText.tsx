/**
 * FloatingXPText Component
 *
 * Displays "+X XP" text that floats up and fades out
 * Used when user completes a habit or earns bonus XP
 *
 * Based on Part B: Micro-Transitions Strategy
 * Duration: 800ms
 * Movement: Floats up 40px
 * Opacity: 1 → 0
 */

import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useReducedMotion,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

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
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      // Skip float animation; just show briefly then complete
      opacity.value = withTiming(0, { duration: 400 }, (finished) => {
        if (finished && onComplete) {
          runOnJS(onComplete)();
        }
      });
      return;
    }

    // Animate upward movement
    translateY.value = withTiming(-40, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });

    // Animate fade out
    opacity.value = withTiming(
      0,
      {
        duration: 800,
        easing: Easing.in(Easing.cubic),
      },
      (finished) => {
        if (finished && onComplete) {
          runOnJS(onComplete)();
        }
      }
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
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
        // Coin variant (gold color)
        <Animated.Text style={styles.coinText}>+{value} 🪙</Animated.Text>
      ) : (
        // XP variant (green gradient - simulate with shadow for now)
        <Animated.Text style={styles.xpText}>+{value} XP</Animated.Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  coinText: {
    color: '#F59E0B',
    fontSize: 17,
    fontWeight: '600', // Amber 500
    textShadowColor: '#F59E0B',
    textShadowOffset: { height: 0, width: 0 },
    textShadowRadius: 8,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  xpText: {
    color: '#047857',
    fontSize: 17,
    fontWeight: '600', // Green 700 (WCAG AA compliant text)
    textShadowColor: '#10B981',
    textShadowOffset: { height: 0, width: 0 },
    textShadowRadius: 8,
  },
});

export default FloatingXPText;
