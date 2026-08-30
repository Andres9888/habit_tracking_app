import { Gesture } from 'react-native-gesture-handler';
import type { SharedValue } from 'react-native-reanimated';
import { runOnJS, withSpring, withTiming } from 'react-native-reanimated';
import {
  DISMISS_THRESHOLD,
  SPRING_SNAP_BACK,
  VELOCITY_THRESHOLD,
} from './constants';

interface Params {
  opacity: SharedValue<number>;
  translateY: SharedValue<number>;
  onSwipeDismiss: () => void;
}

/** Drag-down to dismiss; snaps back on the standard spring otherwise. */
export function useToastPanGesture({
  opacity,
  translateY,
  onSwipeDismiss,
}: Params) {
  return Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 0) {
        translateY.value = e.translationY;
        opacity.value = 1 - e.translationY / 100;
      }
    })
    .onEnd((e) => {
      if (
        e.translationY > DISMISS_THRESHOLD ||
        e.velocityY > VELOCITY_THRESHOLD
      ) {
        runOnJS(onSwipeDismiss)();
      } else {
        translateY.value = withSpring(0, SPRING_SNAP_BACK);
        opacity.value = withTiming(1, { duration: 150 });
      }
    });
}
