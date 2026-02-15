/**
 * Pan Gesture Handler
 * Handles swipe-to-reveal actions with spring physics and haptic feedback.
 * Supports both swipe-left-to-open and swipe-right-to-close.
 */

import { Gesture } from 'react-native-gesture-handler';
import {
  withSpring,
  withTiming,
  runOnJS,
  type SharedValue,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { springs } from '../../../theme/animations';
import { SWIPE_THRESHOLD, ACTION_WIDTH } from '../HabitCard.constants';

const OPEN_POSITION = ACTION_WIDTH * -2;

function triggerLightHaptic() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

export function createPanGesture(
  translateX: SharedValue<number>,
  reduceMotion = false
) {
  let startX = 0;
  let hasTriggeredThresholdHaptic = false;

  return Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onBegin(() => {
      startX = translateX.value;
      hasTriggeredThresholdHaptic = false;
    })
    .onUpdate((event) => {
      // Clamp between fully open and fully closed
      const raw = startX + event.translationX;
      translateX.value = Math.min(0, Math.max(OPEN_POSITION, raw));

      // Haptic tick when crossing the snap threshold
      if (!hasTriggeredThresholdHaptic && translateX.value < SWIPE_THRESHOLD) {
        hasTriggeredThresholdHaptic = true;
        runOnJS(triggerLightHaptic)();
      }
    })
    .onEnd((event) => {
      const snap = reduceMotion
        ? (v: number) => withTiming(v, { duration: 0 })
        : (v: number) => withSpring(v, springs.gesture);

      // Use both position and velocity for natural-feeling snap
      const shouldOpen =
        translateX.value < SWIPE_THRESHOLD || event.velocityX < -800;
      const shouldClose = event.velocityX > 500;

      if (shouldClose) {
        translateX.value = snap(0);
      } else if (shouldOpen) {
        translateX.value = snap(OPEN_POSITION);
      } else {
        // Snap to nearest position
        const openDist = Math.abs(translateX.value - OPEN_POSITION);
        const closeDist = Math.abs(translateX.value);
        translateX.value = snap(
          openDist < closeDist ? OPEN_POSITION : 0
        );
      }
    });
}
