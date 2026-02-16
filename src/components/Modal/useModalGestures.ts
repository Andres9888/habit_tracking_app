/**
 * useModalGestures Hook
 * Gesture handlers for Modal dismissal (bottom sheet and full screen)
 */

import { Gesture } from 'react-native-gesture-handler';
import { withSpring, runOnJS, type SharedValue } from 'react-native-reanimated';
import { HapticPatterns } from '../../utils/haptics/patterns';
import type { ModalVariant } from './Modal.types';
import {
  SCREEN_HEIGHT,
  DISMISS_THRESHOLD,
  VELOCITY_THRESHOLD,
  BOTTOM_SHEET_SPRING_CONFIG,
  EXIT_SPRING_CONFIG,
  GESTURE_SPRING_CONFIG,
} from './Modal.constants';

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
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      // Use Math.round on velocity to avoid precision loss error in Reanimated
      const velocityY = Math.round(event.velocityY);
      if (
        event.translationY > DISMISS_THRESHOLD ||
        velocityY > VELOCITY_THRESHOLD
      ) {
        translateY.value = withSpring(
          SCREEN_HEIGHT,
          BOTTOM_SHEET_SPRING_CONFIG
        );
        runOnJS(HapticPatterns.tap)();
        runOnJS(onClose)();
      } else {
        translateY.value = withSpring(0, BOTTOM_SHEET_SPRING_CONFIG);
      }
    });

  // Pan gesture for fullScreen (swipe down to dismiss - Apple sheet style)
  const panGestureFullScreen = Gesture.Pan()
    .enabled(!disableGestureClose && variant === 'fullScreen')
    .onUpdate((event) => {
      // Allow downward drag with rubber band effect
      if (event.translationY > 0) {
        // Rubber band effect: resistance increases as you drag
        const resistance = 0.4;
        fullScreenGestureY.value = event.translationY * resistance;
      }
    })
    .onEnd((event) => {
      // Use Math.round on velocity to avoid precision loss error in Reanimated
      const velocityY = Math.round(event.velocityY);
      if (
        event.translationY > DISMISS_THRESHOLD ||
        velocityY > VELOCITY_THRESHOLD
      ) {
        // Dismiss
        fullScreenProgress.value = withSpring(0, EXIT_SPRING_CONFIG);
        fullScreenGestureY.value = withSpring(0, GESTURE_SPRING_CONFIG);
        runOnJS(HapticPatterns.tap)();
        runOnJS(onClose)();
      } else {
        // Spring back
        fullScreenGestureY.value = withSpring(0, GESTURE_SPRING_CONFIG);
      }
    });

  return {
    panGestureBottomSheet,
    panGestureFullScreen,
  };
}
