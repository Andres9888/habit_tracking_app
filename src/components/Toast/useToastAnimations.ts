/**
 * Toast Animation Hook
 */

import { useEffect, useCallback, useRef } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { springs } from '@/theme/animations';
import { DISMISS_THRESHOLD } from './constants';

interface UseToastAnimationsParams {
  visible: boolean;
  duration: number;
  onDismiss?: () => void;
}

export function useToastAnimations({
  visible,
  duration,
  onDismiss,
}: UseToastAnimationsParams) {
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);
  const haptic = useHapticFeedback();

  // Use ref for callback to prevent it from triggering useEffect re-runs
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup dismiss timer on unmount
  useEffect(() => {
    return () => {
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    };
  }, []);

  const handleDismiss = useCallback(
    (fromSwipe = false) => {
      // Provide haptic feedback when user swipes to dismiss
      if (fromSwipe) {
        haptic.triggerLightImpact();
      }

      translateY.value = withSpring(100, springs.standard);
      opacity.value = withTiming(0, { duration: 200 });

      if (onDismissRef.current) {
        if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
        dismissTimerRef.current = setTimeout(() => {
          onDismissRef.current?.();
        }, 250);
      }
    },
    [translateY, opacity, haptic]
  );

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, springs.standard);
      opacity.value = withTiming(1, { duration: 200 });

      if (duration > 0 && onDismissRef.current) {
        const timer = setTimeout(() => {
          handleDismiss();
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      translateY.value = withSpring(100, springs.standard);
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible, duration, translateY, opacity, handleDismiss]);

  const handleSwipeDismiss = useCallback(() => {
    handleDismiss(true);
  }, [handleDismiss]);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
        opacity.value = 1 - event.translationY / 100;
      }
    })
    .onEnd((event) => {
      const velocityY = Math.round(event.velocityY);
      if (event.translationY > DISMISS_THRESHOLD || velocityY > 500) {
        runOnJS(handleSwipeDismiss)();
      } else {
        translateY.value = withSpring(0, springs.standard);
        opacity.value = withTiming(1, { duration: 150 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: opacity.value ?? 0,
      transform: [{ translateY: translateY.value ?? 100 }],
    };
  });

  return { animatedStyle, handleDismiss, panGesture };
}
