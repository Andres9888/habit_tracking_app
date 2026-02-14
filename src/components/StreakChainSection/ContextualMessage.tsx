/**
 * ContextualMessage Component
 * Animated motivational message based on streak progress — theme-aware
 */

import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { useThemeColors } from '../../theme/ThemeContext';
import { spacing, borderRadius } from '../../theme/spacing';
import type { ContextualMessageProps, MessageType } from './types';
import { getContextualMessage } from './messageUtils';

/** Gradient configs per message type */
const LIGHT_GRADIENTS: Record<
  MessageType,
  { colors: [string, string]; border: string; text: string }
> = {
  celebrate: { border: '#A7F3D0', colors: ['#ecfdf5', '#f0fdfa'], text: '#047857' },
  motivation: { border: '#C4B5FD', colors: ['#f5f3ff', '#faf5ff'], text: '#6D28D9' },
  record: { border: '#FDE68A', colors: ['#fef3c7', '#fefce8'], text: '#B45309' },
  start: { border: '#FDBA74', colors: ['#fff7ed', '#fffbeb'], text: '#C2410C' },
};

const DARK_GRADIENTS: Record<
  MessageType,
  { colors: [string, string]; border: string; text: string }
> = {
  celebrate: { border: 'rgba(16,185,129,0.3)', colors: ['rgba(16,185,129,0.08)', 'rgba(16,185,129,0.04)'], text: '#6EE7B7' },
  motivation: { border: 'rgba(139,92,246,0.3)', colors: ['rgba(139,92,246,0.08)', 'rgba(139,92,246,0.04)'], text: '#C4B5FD' },
  record: { border: 'rgba(245,158,11,0.3)', colors: ['rgba(245,158,11,0.08)', 'rgba(245,158,11,0.04)'], text: '#FCD34D' },
  start: { border: 'rgba(249,115,22,0.3)', colors: ['rgba(249,115,22,0.08)', 'rgba(249,115,22,0.04)'], text: '#FDBA74' },
};

export function ContextualMessage({
  currentStreak,
  bestStreak,
  todayCompleted,
}: ContextualMessageProps) {
  const { isDark } = useThemeColors();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(8);

  const { message, emoji, type } = getContextualMessage(
    currentStreak,
    bestStreak,
    todayCompleted
  );

  useEffect(() => {
    const delay = 7 * 35 + 100;
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) })
    );
    translateY.value = withDelay(
      delay,
      withSpring(0, { damping: 15, stiffness: 150 })
    );

    return () => {
      cancelAnimation(opacity);
      cancelAnimation(translateY);
    };
  }, [currentStreak, bestStreak, todayCompleted, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const gradients = isDark ? DARK_GRADIENTS : LIGHT_GRADIENTS;
  const { colors, border, text } = gradients[type];

  return (
    <Animated.View
      style={[
        localStyles.container,
        { borderColor: border },
        animatedStyle,
      ]}
    >
      <LinearGradient
        colors={colors}
        end={{ x: 1, y: 0 }}
        start={{ x: 0, y: 0 }}
        style={[StyleSheet.absoluteFillObject, { borderRadius: borderRadius.medium }]}
      />
      <Text style={localStyles.emoji}>{emoji}</Text>
      <Text style={[localStyles.message, { color: text }]}>{message}</Text>
    </Animated.View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginBottom: spacing.base,
    overflow: 'hidden',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm + 2,
  },
  emoji: {
    fontSize: 16,
  },
  message: {
    fontSize: 14,
    fontWeight: '600',
  },
});
