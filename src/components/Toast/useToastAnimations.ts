/**
 * Toast Animation Hook
 */

import { useEffect, useCallback } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

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

  const handleDismiss = useCallback(() => {
    translateY.value = withSpring(100, { damping: 15, stiffness: 150 });
    opacity.value = withTiming(0, { duration: 200 });

    if (onDismiss) {
      setTimeout(() => {
        onDismiss();
      }, 250);
    }
  }, [onDismiss, translateY, opacity]);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
      opacity.value = withTiming(1, { duration: 200 });

      if (duration > 0 && onDismiss) {
        const timer = setTimeout(() => {
          handleDismiss();
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      translateY.value = withSpring(100, { damping: 15, stiffness: 150 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible, duration, onDismiss, translateY, opacity, handleDismiss]);

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
        translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
        opacity.value = withTiming(1, { duration: 150 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return { animatedStyle, handleDismiss, panGesture };
}
