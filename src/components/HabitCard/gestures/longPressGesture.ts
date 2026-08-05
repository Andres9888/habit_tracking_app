/**
 * Long Press Gesture Handler
 * Handles long-press for quick actions menu
 */

import { Gesture } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { HapticPatterns } from '../../../utils/haptics/patterns';

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
        runOnJS(HapticPatterns.heavy)();
        runOnJS(onLongPress)();
      }
    });
}
