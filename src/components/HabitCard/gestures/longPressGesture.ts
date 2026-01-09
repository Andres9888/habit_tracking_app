/**
 * Long Press Gesture Handler
 * Handles long-press for quick actions menu
 */

import { Gesture } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface LongPressGestureOptions {
  disabled: boolean;
  onLongPress?: () => void;
}

export function createLongPressGesture({
  disabled,
  onLongPress,
}: LongPressGestureOptions) {
  return Gesture.LongPress()
    .minDuration(500)
    .onStart(() => {
      if (onLongPress && !disabled) {
        runOnJS(() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(
            () => {}
          );
        })();
        runOnJS(onLongPress)();
      }
    });
}
