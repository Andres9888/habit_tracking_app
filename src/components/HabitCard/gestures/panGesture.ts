/**
 * Pan Gesture Handler
 * Handles swipe-to-reveal actions
 */

import { Gesture } from 'react-native-gesture-handler';
import {
  withSpring,
  withTiming,
  runOnJS,
  type SharedValue,
} from 'react-native-reanimated';
import { HapticPatterns } from '../../../utils/haptics/patterns';
import { springs } from '../../../theme/animations';
import { SWIPE_THRESHOLD, ACTION_WIDTH } from '../HabitCard.constants';

export function createPanGesture(
  translateX: SharedValue<number>,
  reduceMotion = false
) {
  return Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((event) => {
      if (event.translationX < 0) {
        translateX.value = event.translationX;
      }
    })
    .onEnd((event) => {
      const snap = reduceMotion
        ? (v: number) => withTiming(v, { duration: 0 })
        : (v: number) => withSpring(v, springs.snappy);
      if (event.translationX < SWIPE_THRESHOLD) {
        translateX.value = snap(ACTION_WIDTH * -2);
        runOnJS(HapticPatterns.tap)();
      } else {
        translateX.value = snap(0);
      }
    });
}
