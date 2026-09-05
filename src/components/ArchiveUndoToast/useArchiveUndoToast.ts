/**
 * ArchiveUndoToast Hook
 *
 * Manages animation values, gestures, and timing for the toast
 */

import { useEffect, useCallback, useRef } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import {
  DISMISS_THRESHOLD,
  DEFAULT_DURATION,
  type ArchiveUndoToastProps,
} from './types';
import { durations, springs } from '@/theme/animations';

type UseArchiveUndoToastParams = Omit<ArchiveUndoToastProps, 'habitName'>;

export function useArchiveUndoToast({
  visible,
  duration = DEFAULT_DURATION,
  onDismiss,
  onUndo,
}: UseArchiveUndoToastParams) {
  // Animation values
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);
  const progressWidth = useSharedValue(100);

  // Use refs for callbacks to avoid triggering useEffect re-runs
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  const onUndoRef = useRef(onUndo);
  onUndoRef.current = onUndo;

  // Prevent the expiry timer from confirming after Undo, and prevent a swipe
  // racing the timer from confirming twice.
  const dismissedRef = useRef(false);

  const animateOut = useCallback(() => {
    translateY.value = withSpring(100, springs.standard);
    opacity.value = withTiming(0, { duration: durations.standard });
    progressWidth.value = 100;
  }, [translateY, opacity, progressWidth]);

  // Expiry and swipe-away accept the pending archive after the toast exits.
  const confirmDismiss = useCallback(() => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    animateOut();
    if (onDismissRef.current) {
      setTimeout(() => onDismissRef.current?.(), durations.transition);
    }
  }, [animateOut]);

  // Undo cancels the pending archive and only dismisses the toast visually.
  const handleUndo = useCallback(() => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    onUndoRef.current?.();
    animateOut();
  }, [animateOut]);

  // Enter/exit animation
  useEffect(() => {
    if (visible) {
      dismissedRef.current = false;
      progressWidth.value = 100;
      translateY.value = withSpring(0, springs.standard);
      opacity.value = withTiming(1, { duration: durations.standard });
      progressWidth.value = withTiming(0, {
        duration: duration,
        easing: Easing.linear,
      });

      const timer = setTimeout(confirmDismiss, duration);
      return () => clearTimeout(timer);
    }
    dismissedRef.current = true;
    animateOut();
  }, [
    animateOut,
    confirmDismiss,
    duration,
    opacity,
    progressWidth,
    translateY,
    visible,
  ]);

  // Pan gesture for swipe to dismiss
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
        scheduleOnRN(confirmDismiss);
      } else {
        translateY.value = withSpring(0, springs.standard);
        opacity.value = withTiming(1, { duration: durations.quick });
      }
    });

  // Animated styles
  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: progressWidth.value / 100 }],
    transformOrigin: 'left',
  }));

  return { containerStyle, handleUndo, panGesture, progressStyle };
}
