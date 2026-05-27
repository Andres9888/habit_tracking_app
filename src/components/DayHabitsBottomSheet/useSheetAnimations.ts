import { useEffect } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';

import { durations, enterEasing, springs } from '@/theme/animations';
import {
  SCREEN_HEIGHT,
  DISMISS_THRESHOLD,
  VELOCITY_THRESHOLD,
  BACKDROP_FADE_IN_DURATION,
  BACKDROP_FADE_OUT_DURATION,
  BACKDROP_OPACITY,
} from './constants';

const SHEET_TIMING_CONFIG = { duration: durations.sheet, easing: enterEasing };

interface UseSheetAnimationsOptions {
  visible: boolean;
  reduceMotion: boolean;
  onClose: () => void;
  triggerLightImpact: () => void;
}

/**
 * Custom hook for bottom sheet animations
 * Handles slide in/out and backdrop opacity
 */
export function useSheetAnimations({
  visible,
  reduceMotion,
  onClose,
  triggerLightImpact,
}: UseSheetAnimationsOptions) {
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const backdropOpacity = useSharedValue(0);

  // Handle visibility changes
  useEffect(() => {
    if (visible) {
      backdropOpacity.value = reduceMotion
        ? BACKDROP_OPACITY
        : withTiming(BACKDROP_OPACITY, {
            duration: BACKDROP_FADE_IN_DURATION,
            easing: Easing.out(Easing.cubic),
          });
      translateY.value = reduceMotion
        ? 0
        : withTiming(0, {
            duration: BACKDROP_FADE_IN_DURATION,
            easing: Easing.out(Easing.cubic),
          });
    } else {
      backdropOpacity.value = reduceMotion
        ? 0
        : withTiming(0, {
            duration: BACKDROP_FADE_OUT_DURATION,
            easing: Easing.in(Easing.cubic),
          });
      translateY.value = reduceMotion
        ? SCREEN_HEIGHT
        : withTiming(SCREEN_HEIGHT, SHEET_TIMING_CONFIG);
    }
  }, [visible, reduceMotion, backdropOpacity, translateY]);

  // Pan gesture for drag-to-dismiss
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      const velocityY = Math.round(event.velocityY);
      if (
        event.translationY > DISMISS_THRESHOLD ||
        velocityY > VELOCITY_THRESHOLD
      ) {
        translateY.value = withTiming(SCREEN_HEIGHT, SHEET_TIMING_CONFIG);
        runOnJS(triggerLightImpact)();
        runOnJS(onClose)();
      } else {
        translateY.value = withSpring(0, springs.gesture);
      }
    });

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return {
    backdropStyle,
    panGesture,
    sheetStyle,
  };
}
