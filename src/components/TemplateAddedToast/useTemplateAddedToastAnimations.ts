/**
 * Animation hook for TemplateAddedToast
 * Bounce entrance with icon pop, swipe-to-dismiss
 */

import { useCallback } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import {
  DISMISS_THRESHOLD,
  SPRING_BOUNCY,
  VELOCITY_THRESHOLD,
} from './constants';
import { useToastAnimationLifecycle } from './useToastAnimationLifecycle';

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
  const scale = useSharedValue(0.85);
  const iconScale = useSharedValue(0);
  const haptic = useHapticFeedback();
  const handleDismiss = useToastAnimationLifecycle({
    duration,
    haptic,
    iconScale,
    onDismiss,
    opacity,
    scale,
    translateY,
    variant,
    visible,
  });

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
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));
  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  return { handleDismiss, iconStyle, panGesture, toastStyle };
}
