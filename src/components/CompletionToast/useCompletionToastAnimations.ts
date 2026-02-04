/**
 * CompletionToast Animation Hook
 */

import { useEffect, useCallback, useRef } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import { DISMISS_THRESHOLD } from './constants';

interface UseCompletionToastAnimationsParams {
  visible: boolean;
  duration: number;
  onDismiss?: () => void;
}

export function useCompletionToastAnimations(
  params: UseCompletionToastAnimationsParams
) {
  const { visible, duration, onDismiss } = params;
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  const handleDismiss = useCallback(() => {
    translateY.value = withSpring(100, { damping: 15, stiffness: 150 });
    opacity.value = withTiming(0, { duration: 200 });
    scale.value = withTiming(0.9, { duration: 200 });
    if (onDismissRef.current) setTimeout(() => onDismissRef.current?.(), 250);
  }, [translateY, opacity, scale]);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 12, stiffness: 180 });
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withSequence(
        withSpring(1.02, { damping: 10, stiffness: 200 }),
        withSpring(1, { damping: 15, stiffness: 150 })
      );
      if (duration > 0 && onDismissRef.current) {
        const timer = setTimeout(handleDismiss, duration);
        return () => clearTimeout(timer);
      }
    } else {
      translateY.value = withSpring(100, { damping: 15, stiffness: 150 });
      opacity.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(0.9, { duration: 200 });
    }
  }, [visible, duration, translateY, opacity, scale, handleDismiss]);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 0) {
        translateY.value = e.translationY;
        opacity.value = 1 - e.translationY / 100;
      }
    })
    .onEnd((e) => {
      if (e.translationY > DISMISS_THRESHOLD || e.velocityY > 500) {
        runOnJS(handleDismiss)();
      } else {
        translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
        opacity.value = withTiming(1, { duration: 150 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  return { animatedStyle, handleDismiss, panGesture };
}
