/**
 * Animation hook for TemplateAddedToast
 * Settle-in entrance with staggered check badge, swipe-to-dismiss
 */

import { useEffect, useCallback, useMemo, useRef } from 'react';
import { useAnimatedStyle, useReducedMotion, useSharedValue } from 'react-native-reanimated';

import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { ENTER_OFFSET_Y, ENTER_SCALE, EXIT_CALLBACK_DELAY } from './constants';
import { runToastExit } from './toastMotion';
import { useToastPanGesture } from './useToastPanGesture';
import { useToastVisibilityAnimation } from './useToastVisibilityAnimation';

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
  const translateY = useSharedValue(ENTER_OFFSET_Y);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(ENTER_SCALE);
  const iconScale = useSharedValue(1);
  const iconOpacity = useSharedValue(0);
  const values = useMemo(
    () => ({ iconOpacity, iconScale, opacity, scale, translateY }),
    [iconOpacity, iconScale, opacity, scale, translateY]
  );
  const haptic = useHapticFeedback();
  const reduceMotion = useReducedMotion();
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
      runToastExit(values, reduceMotion);
      if (onDismissRef.current) {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(
          () => onDismissRef.current?.(),
          EXIT_CALLBACK_DELAY
        );
      }
    },
    [values, haptic, reduceMotion]
  );

  useToastVisibilityAnimation({
    ...values,
    autoDismissEnabled: Boolean(onDismissRef.current),
    duration,
    handleDismiss,
    reduceMotion,
    triggerAlreadyExistsHaptic: haptic.triggerLightImpact,
    variant,
    visible,
  });

  const swipeDismiss = useCallback(() => handleDismiss(true), [handleDismiss]);
  const panGesture = useToastPanGesture({
    onSwipeDismiss: swipeDismiss,
    opacity,
    translateY,
  });

  const toastStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));
  const iconStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [{ scale: iconScale.value }],
  }));

  return { handleDismiss, iconStyle, panGesture, toastStyle };
}
