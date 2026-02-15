/**
 * Monetization Hero Animations Hook
 * Manages progress, pulse, and shimmer animations
 * 
 * Performance: Uses Reanimated for smooth UI-thread animations
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';

interface UseMonetizationAnimationsOptions {
  freeHabitLimit: number;
  habitSlotsUsed: number;
  hasReachedHabitLimit: boolean;
  reduceMotion: boolean;
}

export function useMonetizationAnimations({
  freeHabitLimit,
  habitSlotsUsed,
  hasReachedHabitLimit,
  reduceMotion,
}: UseMonetizationAnimationsOptions) {
  const progress = useSharedValue(0);
  const ctaPulse = useSharedValue(1);
  const shimmer = useSharedValue(0.4);
  const [trackWidth, setTrackWidth] = useState(0);

  const usageRatio = useMemo(
    () =>
      freeHabitLimit === 0 ? 0 : Math.min(habitSlotsUsed / freeHabitLimit, 1),
    [freeHabitLimit, habitSlotsUsed]
  );

  // Progress bar animation
  useEffect(() => {
    const targetWidth = trackWidth * usageRatio;
    if (reduceMotion) {
      progress.value = targetWidth;
      return;
    }
    progress.value = withTiming(targetWidth, {
      duration: 420,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress, trackWidth, usageRatio, reduceMotion]);

  // CTA pulse animation
  useEffect(() => {
    if (reduceMotion || !hasReachedHabitLimit) {
      ctaPulse.value = 1;
      return;
    }
    ctaPulse.value = withRepeat(
      withSequence(
        withTiming(1.04, {
          duration: 720,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, {
          duration: 720,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1, // infinite
      false
    );
  }, [ctaPulse, hasReachedHabitLimit, reduceMotion]);

  // Shimmer animation
  useEffect(() => {
    if (reduceMotion) {
      shimmer.value = 1;
      return;
    }
    shimmer.value = withRepeat(
      withSequence(
        withTiming(0.9, {
          duration: 960,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0.4, {
          duration: 960,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1, // infinite
      false
    );
  }, [shimmer, reduceMotion]);

  const handleTrackLayout = useCallback(
    (event: { nativeEvent: { layout: { width: number } } }) => {
      setTrackWidth(event.nativeEvent.layout.width);
    },
    []
  );

  const progressStyle = useAnimatedStyle(() => ({
    width: progress.value,
  }));

  const ctaPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ctaPulse.value }],
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: shimmer.value,
  }));

  return {
    ctaPulseStyle,
    handleTrackLayout,
    progressStyle,
    shimmerStyle,
    trackWidth,
  };
}
