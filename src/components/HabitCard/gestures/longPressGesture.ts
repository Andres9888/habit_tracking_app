/**
 * Long Press Gesture Handler
 * Handles long-press for quick actions menu
 */

import { triggerHaptic } from '@/utils/haptics';
import { Gesture } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

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
          triggerHaptic('heavy');
        })();
        runOnJS(onLongPress)();
      }
    });
}
