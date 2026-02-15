/**
 * useSyncedToastAnimations Hook
 *
 * Handles animation logic for the SyncedToast component.
 * Provides smooth fade-in/fade-out transitions with auto-dismiss timing.
 */

import { useEffect, useCallback, useRef } from 'react';

import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

import type {
  UseSyncedToastAnimationsOptions,
  UseSyncedToastAnimationsResult,
} from './types';

const FADE_IN_DURATION = 200;
const FADE_OUT_DURATION = 300;

export function useSyncedToastAnimations({
  visible,
  duration,
  onHidden,
}: UseSyncedToastAnimationsOptions): UseSyncedToastAnimationsResult {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-8);
  const isAnimating = useRef(false);

  const handleHidden = useCallback(() => {
    isAnimating.current = false;
    onHidden?.();
  }, [onHidden]);

  useEffect(() => {
    if (visible && !isAnimating.current) {
      isAnimating.current = true;

      // Fade in, stay visible, then fade out
      opacity.value = withSequence(
        // Fade in
        withTiming(1, {
          duration: FADE_IN_DURATION,
          easing: Easing.out(Easing.cubic),
        }),
        // Stay visible for duration
        withDelay(
          duration,
          // Fade out
          withTiming(
            0,
            {
              duration: FADE_OUT_DURATION,
              easing: Easing.in(Easing.cubic),
            },
            (finished) => {
              if (finished) {
                runOnJS(handleHidden)();
              }
            }
          )
        )
      );

      // Slide in, then slide out
      translateY.value = withSequence(
        withTiming(0, {
          duration: FADE_IN_DURATION,
          easing: Easing.out(Easing.cubic),
        }),
        withDelay(
          duration,
          withTiming(-8, {
            duration: FADE_OUT_DURATION,
            easing: Easing.in(Easing.cubic),
          })
        )
      );
    }
  }, [visible, duration, opacity, translateY, handleHidden]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return {
    animatedStyle,
    shouldRender: visible || isAnimating.current,
  };
}
