/**
 * ContextualMessage Component
 * Animated motivational message based on streak progress
 */

import React, { useEffect } from 'react';
import { Text } from 'react-native';
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
import type { ContextualMessageProps, MessageType } from './types';
import { getContextualMessage } from './messageUtils';
import { springs } from '@/theme/animations';

export function ContextualMessage({
  currentStreak,
  bestStreak,
  todayCompleted,
}: ContextualMessageProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(8);

  const { message, emoji, type } = getContextualMessage(
    currentStreak,
    bestStreak,
    todayCompleted
  );

  useEffect(() => {
    // Animate in after the chain animation completes (7 days * 35ms + buffer)
    const delay = 7 * 35 + 100;
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) })
    );
    translateY.value = withDelay(
      delay,
      withSpring(0, springs.standard)
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

  const gradientMap: Record<
    MessageType,
    { colors: [string, string]; border: string; text: string }
  > = {
    celebrate: { border: 'border-emerald-200', colors: ['#ecfdf5', '#f0fdfa'], text: 'text-emerald-700' },
    motivation: { border: 'border-violet-200', colors: ['#f5f3ff', '#faf5ff'], text: 'text-violet-700' },
    record: { border: 'border-amber-200', colors: ['#fef3c7', '#fefce8'], text: 'text-amber-700' },
    start: { border: 'border-orange-200', colors: ['#fff7ed', '#fffbeb'], text: 'text-orange-700' },
  };

  const { colors, border, text } = gradientMap[type];

  return (
    <Animated.View
      className={`mb-4 flex-row items-center justify-center gap-2 rounded-xl border px-4 py-2.5 ${border}`}
      style={animatedStyle}
    >
      <LinearGradient
        className='absolute inset-0 rounded-xl'
        colors={colors}
        end={{ x: 1, y: 0 }}
        start={{ x: 0, y: 0 }}
      />
      <Text className='text-base'>{emoji}</Text>
      <Text className={`text-sm font-semibold ${text}`}>{message}</Text>
    </Animated.View>
  );
}
