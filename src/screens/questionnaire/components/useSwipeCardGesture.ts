import { useCallback } from 'react';
import { Dimensions } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const FLY_OFF_DURATION = 220;
const MAX_ROTATION_DEG = 14;

interface Options {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export function useSwipeCardGesture({ onSwipeLeft, onSwipeRight }: Options) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const reset = useCallback(() => {
    translateX.value = 0;
    translateY.value = 0;
  }, [translateX, translateY]);

  const flyOff = useCallback(
    (direction: 1 | -1, onDone: () => void) => {
      translateX.value = withTiming(
        direction * SCREEN_WIDTH * 1.2,
        { duration: FLY_OFF_DURATION },
        () => {
          runOnJS(onDone)();
          runOnJS(reset)();
        }
      );
    },
    [reset, translateX]
  );

  const swipeLeft = useCallback(() => flyOff(-1, onSwipeLeft), [flyOff, onSwipeLeft]);
  const swipeRight = useCallback(() => flyOff(1, onSwipeRight), [flyOff, onSwipeRight]);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      'worklet';
      translateX.value = event.translationX;
      translateY.value = event.translationY * 0.25;
    })
    .onEnd(() => {
      'worklet';
      if (translateX.value > SWIPE_THRESHOLD) {
        runOnJS(swipeRight)();
      } else if (translateX.value < -SWIPE_THRESHOLD) {
        runOnJS(swipeLeft)();
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const cardStyle = useAnimatedStyle(() => {
    const rotateZ =
      (translateX.value / SCREEN_WIDTH) * MAX_ROTATION_DEG;
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotateZ: `${rotateZ}deg` },
      ],
    };
  });

  return { panGesture, cardStyle, swipeLeft, swipeRight };
}
