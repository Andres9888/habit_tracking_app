import { useEffect } from 'react';
import type { SharedValue } from 'react-native-reanimated';
import { withTiming } from 'react-native-reanimated';
import { enterEasing } from '@/theme/animations';
import {
  ENTER_FADE_DURATION,
  ENTER_MOVE_DURATION,
  ENTER_OFFSET_Y,
  ENTER_SCALE,
} from './constants';
import { runToastExit } from './toastMotion';

interface ToastVisibilityAnimationOptions {
  autoDismissEnabled: boolean;
  duration: number;
  handleDismiss: () => void;
  iconOpacity: SharedValue<number>;
  iconScale: SharedValue<number>;
  opacity: SharedValue<number>;
  reduceMotion: boolean;
  scale: SharedValue<number>;
  translateY: SharedValue<number>;
  triggerAlreadyExistsHaptic: () => void;
  variant: 'success' | 'already_exists';
  visible: boolean;
}

/**
 * Entrance: card fades in while settling up from a short offset (no
 * overshoot), then the check badge lands one beat later. Reduce Motion
 * collapses everything to a plain crossfade.
 */
export function useToastVisibilityAnimation({
  autoDismissEnabled,
  duration,
  handleDismiss,
  iconOpacity,
  iconScale,
  opacity,
  reduceMotion,
  scale,
  translateY,
  triggerAlreadyExistsHaptic,
  variant,
  visible,
}: ToastVisibilityAnimationOptions): void {
  useEffect(() => {
    if (visible) {
      // Ordinary success intentionally keeps the existing import feedback only.
      if (variant === 'already_exists') {
        triggerAlreadyExistsHaptic();
      }
      const fadeIn = { duration: ENTER_FADE_DURATION, easing: enterEasing };
      if (reduceMotion) {
        translateY.value = 0;
        scale.value = 1;
        iconScale.value = 1;
        opacity.value = withTiming(1, fadeIn);
        iconOpacity.value = withTiming(1, fadeIn);
      } else {
        translateY.value = ENTER_OFFSET_Y;
        scale.value = ENTER_SCALE;
        iconScale.value = 1;
        iconOpacity.value = 0;
        opacity.value = withTiming(1, fadeIn);
        translateY.value = withTiming(0, {
          duration: ENTER_MOVE_DURATION,
          easing: enterEasing,
        });
        scale.value = 1;
        iconOpacity.value = withTiming(1, fadeIn);
      }
      if (autoDismissEnabled && duration > 0) {
        const timer = setTimeout(handleDismiss, duration);
        return () => clearTimeout(timer);
      }
      return;
    }
    runToastExit(
      { iconOpacity, iconScale, opacity, scale, translateY },
      reduceMotion
    );
  }, [
    autoDismissEnabled,
    duration,
    handleDismiss,
    iconOpacity,
    iconScale,
    opacity,
    reduceMotion,
    scale,
    translateY,
    triggerAlreadyExistsHaptic,
    variant,
    visible,
  ]);
}
