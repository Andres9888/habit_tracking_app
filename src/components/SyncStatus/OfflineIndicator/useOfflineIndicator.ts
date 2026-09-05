/**
 * useOfflineIndicator Hook
 *
 * Handles animation logic for the OfflineIndicator component.
 * Provides smooth fade-in/fade-out transitions.
 */

import { useEffect } from 'react';
import { durations } from '@/theme/animations';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const ANIMATION_DURATION = durations.standard;

export interface UseOfflineIndicatorOptions {
  visible: boolean;
}

export interface UseOfflineIndicatorResult {
  animatedStyle: ReturnType<typeof useAnimatedStyle>;
  shouldRender: boolean;
}

export function useOfflineIndicator({
  visible,
}: UseOfflineIndicatorOptions): UseOfflineIndicatorResult {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-8);
  const shouldRender = useSharedValue(false);

  useEffect(() => {
    if (visible) {
      shouldRender.value = true;
      opacity.value = withTiming(1, {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.cubic),
      });
      translateY.value = withTiming(0, {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      opacity.value = withTiming(0, {
        duration: ANIMATION_DURATION,
        easing: Easing.in(Easing.cubic),
      });
      translateY.value = withTiming(-8, {
        duration: ANIMATION_DURATION,
        easing: Easing.in(Easing.cubic),
      });
    }
  }, [visible, opacity, translateY, shouldRender]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return {
    animatedStyle,
    shouldRender: visible,
  };
}
