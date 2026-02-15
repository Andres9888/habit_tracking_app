/**
 * useStreakAnimation Hook
 * Handles animations for streak number and progress bar
 */

import { useEffect } from 'react';

import {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

interface UseStreakAnimationOptions {
  currentStreak: number;
  progress: number;
}

export function useStreakAnimation({
  currentStreak,
  progress,
}: UseStreakAnimationOptions) {
  const numberScale = useSharedValue(1);
  const barWidth = useSharedValue(0);

  // Note: Shared values from Reanimated are stable and intentionally omitted from deps
  useEffect(() => {
    if (currentStreak > 0) {
      numberScale.value = withSequence(
        withSpring(1.08, { damping: 6 }),
        withSpring(1, { damping: 10 })
      );
    }
    barWidth.value = withDelay(150, withSpring(progress, { damping: 15 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStreak, progress]);

  const numberAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: numberScale.value }],
  }));

  const barAnimatedStyle = useAnimatedStyle(() => ({
    width: `${Math.min(barWidth.value * 100, 100)}%`,
  }));

  return { barAnimatedStyle, numberAnimatedStyle };
}
