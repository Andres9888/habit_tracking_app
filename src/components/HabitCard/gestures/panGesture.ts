/**
 * Pan Gesture Handler
 * Handles swipe-to-reveal actions with progressive haptic feedback
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
  let hasTriggeredMidSwipe = false;
  let hasTriggeredFullSwipe = false;

  return Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onBegin(() => {
      // Reset haptic triggers for new gesture
      hasTriggeredMidSwipe = false;
      hasTriggeredFullSwipe = false;
    })
    .onUpdate((event) => {
      if (event.translationX < 0) {
        translateX.value = event.translationX;

        // Progressive haptic feedback at swipe milestones
        const swipeDistance = Math.abs(event.translationX);
        const midpoint = Math.abs(SWIPE_THRESHOLD) / 2;
        const fullThreshold = Math.abs(SWIPE_THRESHOLD);

        // Light haptic at 50% swipe distance
        if (!hasTriggeredMidSwipe && swipeDistance > midpoint) {
          hasTriggeredMidSwipe = true;
          runOnJS(HapticPatterns.swipeProgress)();
        }

        // Medium haptic when crossing full threshold
        if (!hasTriggeredFullSwipe && swipeDistance > fullThreshold) {
          hasTriggeredFullSwipe = true;
          runOnJS(HapticPatterns.toggle)();
        }
      }
    })
    .onEnd((event) => {
      const snap = reduceMotion
        ? (v: number) => withTiming(v, { duration: 0 })
        : (v: number) => withSpring(v, springs.snappy);
      if (event.translationX < SWIPE_THRESHOLD) {
        translateX.value = snap(ACTION_WIDTH * -2);
        // Light haptic on snap to open position
        runOnJS(HapticPatterns.tap)();
      } else {
        translateX.value = snap(0);
      }
    });
}
