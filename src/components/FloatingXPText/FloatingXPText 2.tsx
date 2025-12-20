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

  useEffect(() => {
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
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        {
          position: 'absolute',
          left: startPosition.x,
          top: startPosition.y,
        },
        animatedStyle,
      ]}
      pointerEvents="none"
    >
      {showCoin ? (
        // Coin variant (gold color)
        <Animated.Text style={styles.coinText}>
          +{value} 🪙
        </Animated.Text>
      ) : (
        // XP variant (green gradient - simulate with shadow for now)
        <Animated.Text style={styles.xpText}>
          +{value} XP
        </Animated.Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  xpText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981', // Green 500
    textShadowColor: '#10B981',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  coinText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F59E0B', // Amber 500
    textShadowColor: '#F59E0B',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
});

export default FloatingXPText;
