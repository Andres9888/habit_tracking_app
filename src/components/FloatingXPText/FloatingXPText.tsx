/* eslint-disable max-lines */
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
import { useReduceMotion } from '../../hooks/useReduceMotion';
import { colors } from '@/theme';
import { useThemeColors } from '../../theme/ThemeContext';
import { typography } from '@/theme/typography';
import { durations } from '@/theme/animations';

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
  const { isDark } = useThemeColors();
  const reduceMotion = useReduceMotion();
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion) {
      // Skip animation, just show briefly then call complete
      opacity.value = withTiming(
        0,
        { duration: durations.instant },
        (finished) => {
          if (finished && onComplete) {
            runOnJS(onComplete)();
          }
        }
      );
      return;
    }

    // Animate upward movement
    translateY.value = withTiming(-40, {
      duration: durations.progress,
      easing: Easing.out(Easing.cubic),
    });

    // Animate fade out
    opacity.value = withTiming(
      0,
      {
        duration: durations.progress,
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
        <Animated.Text
          style={[
            styles.coinText,
            isDark && { color: '#FBBF24', textShadowColor: '#FBBF24' },
          ]}
        >
          +{value} 🪙
        </Animated.Text>
      ) : (
        // XP variant (green gradient - simulate with shadow for now)
        <Animated.Text
          style={[
            styles.xpText,
            isDark && {
              color: colors.primary[400],
              textShadowColor: colors.primary[400],
            },
          ]}
        >
          +{value} XP
        </Animated.Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  coinText: {
    ...typography.button,
    color: '#F59E0B', // Amber 500
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
    ...typography.button,
    color: colors.primary[700], // Green 700 (WCAG AA compliant text)
    textShadowColor: colors.primary[500],
    textShadowOffset: { height: 0, width: 0 },
    textShadowRadius: 8,
  },
});

export default FloatingXPText;
