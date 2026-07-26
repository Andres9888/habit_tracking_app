import { useCallback, useEffect, useRef } from 'react';
import type { SharedValue } from 'react-native-reanimated';
import {
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import type { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { SPRING_BOUNCY, SPRING_EXIT, SPRING_ICON } from './constants';

interface ToastAnimationLifecycleParams {
  duration: number;
  haptic: ReturnType<typeof useHapticFeedback>;
  iconScale: SharedValue<number>;
  onDismiss?: () => void;
  opacity: SharedValue<number>;
  scale: SharedValue<number>;
  translateY: SharedValue<number>;
  variant: 'success' | 'already_exists';
  visible: boolean;
}

export function useToastAnimationLifecycle({
  duration,
  haptic,
  iconScale,
  onDismiss,
  opacity,
  scale,
  translateY,
  variant,
  visible,
}: ToastAnimationLifecycleParams) {
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  const handleDismiss = useCallback(
    (fromSwipe = false) => {
      if (fromSwipe) haptic.triggerLightImpact();
      translateY.value = withSpring(120, SPRING_EXIT);
      opacity.value = withTiming(0, { duration: 280 });
      scale.value = withTiming(0.9, { duration: 280 });
      iconScale.value = withTiming(0, { duration: 200 });
      if (onDismissRef.current) {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => onDismissRef.current?.(), 300);
      }
    },
    [translateY, opacity, scale, iconScale, haptic]
  );

  useEffect(() => {
    if (visible) {
      if (variant === 'already_exists') haptic.triggerLightImpact();
      translateY.value = withSpring(0, SPRING_BOUNCY);
      opacity.value = withTiming(1, { duration: 250 });
      scale.value = withSequence(
        withSpring(1.02, SPRING_BOUNCY),
        withSpring(1, SPRING_EXIT)
      );
      iconScale.value = withDelay(
        200,
        withSequence(
          withSpring(1.15, SPRING_ICON),
          withSpring(1, SPRING_EXIT)
        )
      );
      if (duration > 0 && onDismissRef.current) {
        const timeout = setTimeout(() => handleDismiss(), duration);
        return () => clearTimeout(timeout);
      }
      return;
    }
    translateY.value = withSpring(120, SPRING_EXIT);
    opacity.value = withTiming(0, { duration: 280 });
    scale.value = withTiming(0.85, { duration: 280 });
    iconScale.value = withTiming(0, { duration: 200 });
  }, [
    visible,
    duration,
    translateY,
    opacity,
    scale,
    iconScale,
    handleDismiss,
    haptic,
    variant,
  ]);

  return handleDismiss;
}
