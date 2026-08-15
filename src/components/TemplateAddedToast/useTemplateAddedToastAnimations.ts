/**
 * Animation hook for TemplateAddedToast
 * Bounce entrance with icon pop, swipe-to-dismiss
 */

import { useEffect, useCallback, useRef } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';

import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import {
  DISMISS_THRESHOLD,
  SPRING_BOUNCY,
  SPRING_EXIT,
  SPRING_ICON,
  VELOCITY_THRESHOLD,
} from './constants';

interface Params {
  visible: boolean;
  duration: number;
  onDismiss?: () => void;
  variant?: 'success' | 'already_exists';
}

export function useTemplateAddedToastAnimations({
  visible,
  duration,
  onDismiss,
  variant = 'success',
}: Params) {
  const translateY = useSharedValue(120);
  const opacity = useSharedValue(0);
  const iconScale = useSharedValue(0);
  const haptic = useHapticFeedback();
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
      iconScale.value = withTiming(0, { duration: 200 });
      if (onDismissRef.current) {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => onDismissRef.current?.(), 300);
      }
    },
    [translateY, opacity, iconScale, haptic]
  );

  useEffect(() => {
    if (visible) {
      if (variant === 'already_exists') {
        haptic.triggerLightImpact();
      }
      translateY.value = withSpring(0, SPRING_BOUNCY);
      opacity.value = withTiming(1, { duration: 250 });
      iconScale.value = withDelay(
        200,
        withSequence(withSpring(1.15, SPRING_ICON), withSpring(1, SPRING_EXIT))
      );
      if (duration > 0 && onDismissRef.current) {
        const t = setTimeout(() => handleDismiss(), duration);
        return () => clearTimeout(t);
      }
    } else {
      translateY.value = withSpring(120, SPRING_EXIT);
      opacity.value = withTiming(0, { duration: 280 });
      iconScale.value = withTiming(0, { duration: 200 });
    }
  }, [
    visible,
    duration,
    translateY,
    opacity,
    iconScale,
    handleDismiss,
    haptic,
    variant,
  ]);

  const swipeDismiss = useCallback(() => handleDismiss(true), [handleDismiss]);
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 0) {
        translateY.value = e.translationY;
        opacity.value = 1 - e.translationY / 100;
      }
    })
    .onEnd((e) => {
      if (
        e.translationY > DISMISS_THRESHOLD ||
        e.velocityY > VELOCITY_THRESHOLD
      ) {
        runOnJS(swipeDismiss)();
      } else {
        translateY.value = withSpring(0, SPRING_BOUNCY);
        opacity.value = withTiming(1, { duration: 150 });
      }
    });

  const toastStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    // Keep text at a stable 1:1 scale. Scaling the entire card makes iOS
    // temporarily rasterize its text at the spring's intermediate resolution,
    // which looks blurry on high-density displays until the animation settles.
    transform: [{ translateY: translateY.value }],
  }));
  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  return { handleDismiss, iconStyle, panGesture, toastStyle };
}
