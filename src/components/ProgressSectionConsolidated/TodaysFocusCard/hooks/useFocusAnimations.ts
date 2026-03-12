/**
 * useFocusAnimations Hook
 *
 * Animation hooks for entrance, shimmer, celebration, and badge effects.
 */

import { useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
  SharedValue,
} from 'react-native-reanimated';

import { springs } from '@/theme/animations';
import {
  ENTRANCE_DURATION,
  SHIMMER_DURATION,
} from '../TodaysFocusCard.constants';

export interface UseFocusAnimationsResult {
  scale: SharedValue<number>;
  opacity: SharedValue<number>;
  shimmerPosition: SharedValue<number>;
  badgeScale: SharedValue<number>;
  shareButtonOpacity: SharedValue<number>;
  containerAnimatedStyle: ReturnType<typeof useAnimatedStyle>;
  shimmerAnimatedStyle: ReturnType<typeof useAnimatedStyle>;
  badgeAnimatedStyle: ReturnType<typeof useAnimatedStyle>;
  shareButtonAnimatedStyle: ReturnType<typeof useAnimatedStyle>;
}

export function useFocusAnimations(
  reduceMotion: boolean
): UseFocusAnimationsResult {
  const scale = useSharedValue(reduceMotion ? 1 : 0.95);
  const opacity = useSharedValue(reduceMotion ? 1 : 0);
  const shimmerPosition = useSharedValue(0);
  const badgeScale = useSharedValue(0);
  const shareButtonOpacity = useSharedValue(0);

  // Entrance animation
  useEffect(() => {
    if (reduceMotion) {
      scale.value = 1;
      opacity.value = 1;
      return;
    }

    scale.value = withSpring(1, springs.sheet);
    opacity.value = withTiming(1, {
      duration: ENTRANCE_DURATION,
      easing: Easing.out(Easing.cubic),
    });
  }, [reduceMotion, scale, opacity]);

  // Shimmer animation
  useEffect(() => {
    if (reduceMotion) return;

    shimmerPosition.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: SHIMMER_DURATION,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0, { duration: 0 })
      ),
      -1,
      false
    );
  }, [reduceMotion, shimmerPosition]);

  // Animated styles
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const shimmerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmerPosition.value, [0, 0.5, 1], [0, 0.3, 0]),
    transform: [
      { translateX: interpolate(shimmerPosition.value, [0, 1], [-200, 400]) },
    ],
  }));

  const badgeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  const shareButtonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: shareButtonOpacity.value,
  }));

  return {
    badgeAnimatedStyle,
    badgeScale,
    containerAnimatedStyle,
    opacity,
    scale,
    shareButtonAnimatedStyle,
    shareButtonOpacity,
    shimmerAnimatedStyle,
    shimmerPosition,
  };
}
