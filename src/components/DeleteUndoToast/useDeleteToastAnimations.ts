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

import { springs } from '../../theme/animations';
import { DISMISS_THRESHOLD } from './styles';

interface UseDeleteToastAnimationsOptions {
  visible: boolean;
  duration: number;
  onConfirm: () => void;
  onUndo: () => void;
  onDismiss?: () => void;
}

/**
 * Custom hook for DeleteUndoToast animations and gestures
 */
export function useDeleteToastAnimations({
  visible,
  duration,
  onConfirm,
  onUndo,
  onDismiss,
}: UseDeleteToastAnimationsOptions) {
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);
  const progressWidth = useSharedValue(100);

  // Use refs for callbacks to prevent them from triggering re-renders
  const onConfirmRef = useRef(onConfirm);
  onConfirmRef.current = onConfirm;

  const onUndoRef = useRef(onUndo);
  onUndoRef.current = onUndo;

  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup dismiss timer on unmount
  useEffect(() => {
    return () => {
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    };
  }, []);

  const handleDismiss = useCallback(() => {
    translateY.value = withSpring(100, springs.snappy);
    opacity.value = withTiming(0, { duration: 200 });
    progressWidth.value = 100;

    if (onDismissRef.current) {
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = setTimeout(() => onDismissRef.current?.(), 250);
    }
  }, [translateY, opacity, progressWidth]);

  const handleUndo = useCallback(() => {
    onUndoRef.current?.();
    handleDismiss();
  }, [handleDismiss]);

  const handleConfirm = useCallback(() => {
    onConfirmRef.current?.();
    handleDismiss();
  }, [handleDismiss]);

  useEffect(() => {
    if (visible) {
      progressWidth.value = 100;
      translateY.value = withSpring(0, springs.snappy);
      opacity.value = withTiming(1, { duration: 200 });
      progressWidth.value = withTiming(0, {
        duration,
        easing: Easing.linear,
      });

      const timer = setTimeout(handleConfirm, duration);
      return () => clearTimeout(timer);
    } else {
      translateY.value = withSpring(100, springs.snappy);
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible, duration, handleConfirm, translateY, opacity, progressWidth]);

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
        runOnJS(handleUndo)();
      } else {
        translateY.value = withSpring(0, springs.snappy);
        opacity.value = withTiming(1, { duration: 150 });
      }
    });

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  return { containerStyle, panGesture, progressStyle };
}
