/**
 * CompletionToast Animation Hook
 */

import { useEffect, useCallback, useRef } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import {
  useAnimatedStyle,
  useReducedMotion,
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
  const reduceMotion = useReducedMotion();
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  const handleDismiss = useCallback(() => {
    translateY.value = reduceMotion
      ? withTiming(100, { duration: 0 })
      : withSpring(100, { damping: 18, stiffness: 150 });
    opacity.value = withTiming(0, { duration: reduceMotion ? 0 : 280 });
    scale.value = withTiming(0.9, { duration: reduceMotion ? 0 : 280 });
    if (onDismissRef.current) setTimeout(() => onDismissRef.current?.(), reduceMotion ? 0 : 300);
  }, [translateY, opacity, scale, reduceMotion]);

  useEffect(() => {
    if (visible) {
      translateY.value = reduceMotion
        ? withTiming(0, { duration: 0 })
        : withSpring(0, { damping: 18, stiffness: 180 });
      opacity.value = withTiming(1, { duration: reduceMotion ? 0 : 280 });
      scale.value = reduceMotion
        ? withTiming(1, { duration: 0 })
        : withSequence(
            withSpring(1.02, { damping: 18, stiffness: 200 }),
            withSpring(1, { damping: 18, stiffness: 150 })
          );
      if (duration > 0 && onDismissRef.current) {
        const timer = setTimeout(handleDismiss, duration);
        return () => clearTimeout(timer);
      }
    } else {
      translateY.value = reduceMotion
        ? withTiming(100, { duration: 0 })
        : withSpring(100, { damping: 18, stiffness: 150 });
      opacity.value = withTiming(0, { duration: reduceMotion ? 0 : 280 });
      scale.value = withTiming(0.9, { duration: reduceMotion ? 0 : 280 });
    }
  }, [visible, duration, translateY, opacity, scale, handleDismiss, reduceMotion]);

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
        translateY.value = withSpring(0, { damping: 18, stiffness: 150 });
        opacity.value = withTiming(1, { duration: 280 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  return { animatedStyle, handleDismiss, panGesture };
}
