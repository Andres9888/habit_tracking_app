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
  runOnJS,
  Easing,
} from 'react-native-reanimated';

import { DISMISS_THRESHOLD, DEFAULT_DURATION } from './types';
import { springs } from '@/theme/animations';

interface UseArchiveUndoToastParams {
  visible: boolean;
  duration?: number;
  onDismiss?: () => void;
  onUndo?: () => void;
}

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

  // Handle dismiss
  const handleDismiss = useCallback(() => {
    translateY.value = withSpring(100, springs.standard);
    opacity.value = withTiming(0, { duration: 200 });
    progressWidth.value = 100;

    if (onDismissRef.current) {
      setTimeout(() => onDismissRef.current?.(), 250);
    }
  }, [translateY, opacity, progressWidth]);

  // Handle undo action
  const handleUndo = useCallback(() => {
    onUndoRef.current?.();
    handleDismiss();
  }, [handleDismiss]);

  // Enter/exit animation
  useEffect(() => {
    if (visible) {
      progressWidth.value = 100;
      translateY.value = withSpring(0, springs.standard);
      opacity.value = withTiming(1, { duration: 200 });
      progressWidth.value = withTiming(0, {
        duration: duration,
        easing: Easing.linear,
      });

      const timer = setTimeout(() => handleDismiss(), duration);
      return () => clearTimeout(timer);
    } else {
      translateY.value = withSpring(100, springs.standard);
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible, duration, handleDismiss, translateY, opacity, progressWidth]);

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
        runOnJS(handleDismiss)();
      } else {
        translateY.value = withSpring(0, springs.standard);
        opacity.value = withTiming(1, { duration: 150 });
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

  return {
    containerStyle,
    handleUndo,
    panGesture,
    progressStyle,
  };
}
