import { useEffect, useCallback } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';

import { DISMISS_THRESHOLD } from './styles';

interface UseDeleteToastAnimationsOptions {
  visible: boolean;
  duration: number;
  onConfirm: () => void;
  onUndo: () => void;
  onDismiss?: () => void;
}

const SPRING_CONFIG = { damping: 15, stiffness: 150 };

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

  const handleDismiss = useCallback(() => {
    translateY.value = withSpring(100, SPRING_CONFIG);
    opacity.value = withTiming(0, { duration: 200 });
    progressWidth.value = 100;

    if (onDismiss) {
      setTimeout(onDismiss, 250);
    }
  }, [onDismiss, translateY, opacity, progressWidth]);

  const handleUndo = useCallback(() => {
    onUndo();
    handleDismiss();
  }, [onUndo, handleDismiss]);

  const handleConfirm = useCallback(() => {
    onConfirm();
    handleDismiss();
  }, [onConfirm, handleDismiss]);

  useEffect(() => {
    if (visible) {
      progressWidth.value = 100;
      translateY.value = withSpring(0, SPRING_CONFIG);
      opacity.value = withTiming(1, { duration: 200 });
      progressWidth.value = withTiming(0, {
        duration,
        easing: Easing.linear,
      });

      const timer = setTimeout(handleConfirm, duration);
      return () => clearTimeout(timer);
    } else {
      translateY.value = withSpring(100, SPRING_CONFIG);
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
        translateY.value = withSpring(0, SPRING_CONFIG);
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
