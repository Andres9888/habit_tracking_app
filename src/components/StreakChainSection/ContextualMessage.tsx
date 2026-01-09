/**
 * ContextualMessage Component
 * Animated motivational message based on streak progress
 */

import React, { useEffect } from 'react';
import { Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import type { ContextualMessageProps } from './types';
import { getContextualMessage, MESSAGE_STYLES } from './messageUtils';

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

  const { bgColor, textColor } = MESSAGE_STYLES[type];

  return (
    <Animated.View
      className={`mb-4 flex-row items-center justify-center gap-2 rounded-xl border px-4 py-2.5 ${bgColor}`}
      style={animatedStyle}
    >
      <Text className='text-base'>{emoji}</Text>
      <Text className={`text-sm font-semibold ${textColor}`}>{message}</Text>
    </Animated.View>
  );
}
