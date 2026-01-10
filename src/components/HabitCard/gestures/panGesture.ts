/**
 * Pan Gesture Handler
 * Handles swipe-to-reveal actions
 */

import { Gesture } from 'react-native-gesture-handler';
import { withSpring, runOnJS, type SharedValue } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { SWIPE_THRESHOLD, ACTION_WIDTH } from '../HabitCard.constants';

export function createPanGesture(translateX: SharedValue<number>) {
  return Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((event) => {
      if (event.translationX < 0) {
        translateX.value = event.translationX;
      }
    })
    .onEnd((event) => {
      if (event.translationX < SWIPE_THRESHOLD) {
        translateX.value = withSpring(ACTION_WIDTH * -2, {
          damping: 15,
          stiffness: 150,
        });
        runOnJS(() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
            () => {}
          );
        })();
      } else {
        translateX.value = withSpring(0, { damping: 15, stiffness: 150 });
      }
    });
}
