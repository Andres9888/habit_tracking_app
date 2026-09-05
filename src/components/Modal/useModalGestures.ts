/**
 * useModalGestures Hook
 * Gesture handlers for Modal dismissal (bottom sheet and full screen)
 */

import { Gesture } from 'react-native-gesture-handler';
import {
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { durations, exitEasing, sheetEasing } from '@/theme/animations';
import { project, rubberband } from '@/theme/sheetMotion';
import { HapticPatterns } from '../../utils/haptics/patterns';
import type { ModalVariant } from './Modal.types';
import {
  SCREEN_HEIGHT,
  DISMISS_THRESHOLD,
  VELOCITY_THRESHOLD,
  GESTURE_SPRING_CONFIG,
} from './Modal.constants';

const SHEET_EXIT = { duration: durations.sheet, easing: sheetEasing };
const FULL_SCREEN_EXIT = { duration: 350, easing: exitEasing };

interface UseModalGesturesParams {
  variant: ModalVariant;
  disableGestureClose: boolean;
  translateY: SharedValue<number>;
  fullScreenProgress: SharedValue<number>;
  fullScreenGestureY: SharedValue<number>;
  onClose: () => void;
}

export function useModalGestures({
  variant,
  disableGestureClose,
  translateY,
  fullScreenProgress,
  fullScreenGestureY,
  onClose,
}: UseModalGesturesParams) {
  // Pan gesture for bottom sheet (pull down to dismiss)
  const panGestureBottomSheet = Gesture.Pan()
    .enabled(!disableGestureClose && variant === 'bottomSheet')
    .onUpdate((event) => {
      'worklet';
      translateY.value =
        event.translationY >= 0
          ? event.translationY
          : rubberband(event.translationY, SCREEN_HEIGHT);
    })
    .onEnd((event) => {
      'worklet';
      const projected = translateY.value + project(event.velocityY);
      const shouldDismiss =
        event.translationY > DISMISS_THRESHOLD ||
        projected > DISMISS_THRESHOLD ||
        event.velocityY > VELOCITY_THRESHOLD;

      if (shouldDismiss) {
        translateY.value = withTiming(SCREEN_HEIGHT, SHEET_EXIT);
        scheduleOnRN(HapticPatterns.tap);
        scheduleOnRN(onClose);
      } else {
        translateY.value = withSpring(0, {
          ...GESTURE_SPRING_CONFIG,
          velocity: event.velocityY,
        });
      }
    });

  // Pan gesture for fullScreen (swipe down to dismiss - Apple sheet style)
  const panGestureFullScreen = Gesture.Pan()
    .enabled(!disableGestureClose && variant === 'fullScreen')
    .onUpdate((event) => {
      'worklet';
      // Rubber band effect: resistance increases as you drag.
      const resistance = 0.4;
      fullScreenGestureY.value =
        event.translationY >= 0 ? event.translationY * resistance : 0;
    })
    .onEnd((event) => {
      'worklet';
      const projected = fullScreenGestureY.value + project(event.velocityY);
      const shouldDismiss =
        event.translationY > DISMISS_THRESHOLD ||
        projected > DISMISS_THRESHOLD ||
        event.velocityY > VELOCITY_THRESHOLD;

      if (shouldDismiss) {
        // Dismiss — timing-based to match native slide
        fullScreenProgress.value = withTiming(0, FULL_SCREEN_EXIT);
        fullScreenGestureY.value = withTiming(0, FULL_SCREEN_EXIT);
        scheduleOnRN(HapticPatterns.tap);
        scheduleOnRN(onClose);
      } else {
        // Spring back
        fullScreenGestureY.value = withSpring(0, {
          ...GESTURE_SPRING_CONFIG,
          velocity: event.velocityY,
        });
      }
    });

  return {
    panGestureBottomSheet,
    panGestureFullScreen,
  };
}
