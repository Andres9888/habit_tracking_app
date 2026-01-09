/**
 * useVisionBoardGestures Hook
 * Manages pan gesture for swipe-to-dismiss and navigation
 */

import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import {
  SCREEN_HEIGHT,
  DISMISS_THRESHOLD,
  SWIPE_VELOCITY_THRESHOLD,
  HORIZONTAL_SWIPE_THRESHOLD,
} from './VisionBoardPreview.constants';

interface UseVisionBoardGesturesParams {
  reduceMotion: boolean;
  hasNext: boolean;
  hasPrev: boolean;
  goToNext: () => void;
  goToPrev: () => void;
  handleClose: () => void;
}

const SPRING_CONFIG = { damping: 20, stiffness: 200 };
const springValue = (reduceMotion: boolean, val: number) =>
  reduceMotion ? val : withSpring(val, SPRING_CONFIG);

export function useVisionBoardGestures({
  reduceMotion,
  hasNext,
  hasPrev,
  goToNext,
  goToPrev,
  handleClose,
}: UseVisionBoardGesturesParams) {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const resetAnimations = () => {
    translateY.value = springValue(reduceMotion, 0);
    translateX.value = springValue(reduceMotion, 0);
    scale.value = springValue(reduceMotion, 1);
    opacity.value = springValue(reduceMotion, 1);
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (Math.abs(event.translationY) > Math.abs(event.translationX)) {
        translateY.value = event.translationY;
        const progress = Math.abs(event.translationY) / DISMISS_THRESHOLD;
        scale.value = interpolate(
          progress,
          [0, 1],
          [1, 0.9],
          Extrapolation.CLAMP
        );
        opacity.value = interpolate(
          progress,
          [0, 1],
          [1, 0.7],
          Extrapolation.CLAMP
        );
      } else {
        translateX.value = event.translationX;
      }
    })
    .onEnd((event) => {
      const velocityY = Math.round(event.velocityY);
      const velocityX = Math.round(event.velocityX);

      // Dismiss
      if (
        Math.abs(event.translationY) > DISMISS_THRESHOLD ||
        Math.abs(velocityY) > SWIPE_VELOCITY_THRESHOLD
      ) {
        translateY.value = reduceMotion
          ? SCREEN_HEIGHT
          : withTiming(SCREEN_HEIGHT, { duration: 200 });
        opacity.value = reduceMotion ? 0 : withTiming(0, { duration: 200 });
        runOnJS(handleClose)();
        return;
      }

      // Navigate left/right
      if (
        event.translationX < -HORIZONTAL_SWIPE_THRESHOLD ||
        velocityX < -SWIPE_VELOCITY_THRESHOLD
      ) {
        if (hasNext) runOnJS(goToNext)();
      } else if (
        (event.translationX > HORIZONTAL_SWIPE_THRESHOLD ||
          velocityX > SWIPE_VELOCITY_THRESHOLD) &&
        hasPrev
      )
        runOnJS(goToPrev)();
      resetAnimations();
    });

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { scale: scale.value },
    ],
  }));

  return { animatedContainerStyle, panGesture };
}
