/**
 * useSwipeDismissGesture — drag-to-dismiss pan gesture for useSwipeDismiss.
 *
 * Velocity-aware release, structured like `useNoteSheetGesture`: dismiss
 * when the projected landing position clears the threshold (distance OR
 * flick), otherwise spring back with the release velocity. Dragging past
 * the resting position resists via `rubberband` instead of clamping.
 */
import { Gesture } from 'react-native-gesture-handler';
import {
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { durations, springs } from '@/theme/animations';
import { project, rubberband } from '@/theme/sheetMotion';
import { HapticPatterns } from '@/utils/haptics/patterns';
import {
  DISMISS_THRESHOLD,
  SCREEN_HEIGHT,
  VELOCITY_THRESHOLD,
} from '@/components/Modal/Modal.constants';

export const BACKDROP_TARGET = 0.5;

interface UseSwipeDismissGestureOptions {
  translateY: SharedValue<number>;
  backdropOpacity: SharedValue<number>;
  onDismiss: () => void;
}

export function useSwipeDismissGesture({
  translateY,
  backdropOpacity,
  onDismiss,
}: UseSwipeDismissGestureOptions) {
  return Gesture.Pan()
    .onUpdate((event) => {
      'worklet';
      const resisted =
        event.translationY >= 0
          ? event.translationY
          : rubberband(event.translationY, SCREEN_HEIGHT);
      translateY.value = resisted;
      const progress = 1 - resisted / SCREEN_HEIGHT;
      backdropOpacity.value = Math.max(0, progress * BACKDROP_TARGET);
    })
    .onEnd((event) => {
      'worklet';
      const projected = translateY.value + project(event.velocityY);
      const shouldDismiss =
        translateY.value > DISMISS_THRESHOLD ||
        projected > DISMISS_THRESHOLD ||
        event.velocityY > VELOCITY_THRESHOLD;

      if (shouldDismiss) {
        scheduleOnRN(HapticPatterns.tap);
        scheduleOnRN(onDismiss);
      } else {
        translateY.value = withSpring(0, {
          ...springs.gesture,
          velocity: event.velocityY,
        });
        backdropOpacity.value = withTiming(BACKDROP_TARGET, {
          duration: durations.standard,
        });
      }
    });
}
