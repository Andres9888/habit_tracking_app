/**
 * useSortSheetGesture — drag-to-dismiss pan gesture for SortBottomSheet.
 *
 * Velocity-aware release, structured like `useNoteSheetGesture`: dismiss
 * when the projected landing position clears the threshold (distance OR
 * flick), otherwise spring back with the release velocity. Overdrag above
 * the resting position resists via `rubberband` instead of clamping.
 */
import { Gesture } from 'react-native-gesture-handler';
import {
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { durations, sheetEasing, springs } from '@/theme/animations';
import { project, rubberband } from '@/theme/sheetMotion';
import {
  DISMISS_THRESHOLD,
  SCREEN_HEIGHT,
  VELOCITY_THRESHOLD,
} from './constants';

export const SHEET_TIMING_CONFIG = {
  duration: durations.sheet,
  easing: sheetEasing,
};

interface UseSortSheetGestureOptions {
  translateY: SharedValue<number>;
  onDismiss: () => void;
  triggerLightImpact: () => void;
}

export function useSortSheetGesture({
  translateY,
  onDismiss,
  triggerLightImpact,
}: UseSortSheetGestureOptions) {
  return Gesture.Pan()
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
        translateY.value = withTiming(SCREEN_HEIGHT, SHEET_TIMING_CONFIG);
        scheduleOnRN(triggerLightImpact);
        scheduleOnRN(onDismiss);
      } else {
        translateY.value = withSpring(0, {
          ...springs.gesture,
          velocity: event.velocityY,
        });
      }
    });
}
