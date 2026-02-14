/**
 * Sheet animations for QuickAddHabitSheet.
 * Reuses the same spring config and patterns as DayHabitsBottomSheet.
 */

import { useEffect } from 'react';
import { Dimensions } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const SPRING_CONFIG = {
  damping: 18,
  mass: 1,
  stiffness: 120,
};

const DISMISS_THRESHOLD = 100;
const VELOCITY_THRESHOLD = 800;
const BACKDROP_OPACITY = 0.4;

interface UseSheetAnimationsOptions {
  visible: boolean;
  reduceMotion: boolean;
  onClose: () => void;
  triggerLightImpact: () => void;
}

export function useSheetAnimations({
  visible,
  reduceMotion,
  onClose,
  triggerLightImpact,
}: UseSheetAnimationsOptions) {
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      backdropOpacity.value = reduceMotion
        ? BACKDROP_OPACITY
        : withTiming(BACKDROP_OPACITY, {
            duration: 300,
            easing: Easing.out(Easing.cubic),
          });
      translateY.value = reduceMotion ? 0 : withSpring(0, SPRING_CONFIG);
    } else {
      backdropOpacity.value = reduceMotion
        ? 0
        : withTiming(0, { duration: 250, easing: Easing.in(Easing.cubic) });
      translateY.value = reduceMotion
        ? SCREEN_HEIGHT
        : withSpring(SCREEN_HEIGHT, SPRING_CONFIG);
    }
  }, [visible, reduceMotion, backdropOpacity, translateY]);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (
        event.translationY > DISMISS_THRESHOLD ||
        event.velocityY > VELOCITY_THRESHOLD
      ) {
        translateY.value = withSpring(SCREEN_HEIGHT, SPRING_CONFIG);
        runOnJS(triggerLightImpact)();
        runOnJS(onClose)();
      } else {
        translateY.value = withSpring(0, SPRING_CONFIG);
      }
    });

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return { backdropStyle, panGesture, sheetStyle };
}
