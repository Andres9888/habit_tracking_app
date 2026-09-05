/**
 * usePendingSyncBadge Hook
 *
 * Handles animation logic for the PendingSyncBadge component.
 * Provides smooth scale and fade transitions for pending state indication.
 */

import { useEffect } from 'react';
import { durations } from '@/theme/animations';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import type {
  UsePendingSyncBadgeOptions,
  UsePendingSyncBadgeResult,
} from './types';

const ANIMATION_DURATION = durations.quick;

export function usePendingSyncBadge({
  visible,
}: UsePendingSyncBadgeOptions): UsePendingSyncBadgeResult {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.cubic),
      });
      scale.value = withTiming(1, {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.back(1.5)),
      });
    } else {
      opacity.value = withTiming(0, {
        duration: ANIMATION_DURATION,
        easing: Easing.in(Easing.cubic),
      });
      scale.value = withTiming(0.8, {
        duration: ANIMATION_DURATION,
        easing: Easing.in(Easing.cubic),
      });
    }
  }, [visible, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return {
    animatedStyle,
    shouldRender: visible,
  };
}
