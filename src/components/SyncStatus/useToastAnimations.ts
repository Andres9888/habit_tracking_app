/**
 * useToastAnimations Hook
 *
 * Shared fade-in/fade-out + auto-dismiss animation logic, used by
 * SyncedToast and the general Toast component.
 *
 * Note: ConflictNotification does NOT use this hook — it intentionally
 * animates with a different motion (durations.enter / translateY -20 vs
 * this hook's 200/300ms / translateY -8). Unifying them would require
 * parameterizing offset + durations here and would change ConflictNotification's
 * feel, so the two are kept separate on purpose.
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

export interface UseToastAnimationsOptions {
  visible: boolean;
  duration: number;
  onHidden?: () => void;
}

export interface UseToastAnimationsResult {
  animatedStyle: { opacity: number; transform: { translateY: number }[] };
  shouldRender: boolean;
}

const FADE_IN_DURATION = 200;
const FADE_OUT_DURATION = 300;

export function useToastAnimations({
  visible,
  duration,
  onHidden,
}: UseToastAnimationsOptions): UseToastAnimationsResult {
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
