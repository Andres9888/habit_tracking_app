import { useEffect } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import {
  durations,
  enterEasing,
  exitEasing,
  sheetEasing,
  springs,
} from '@/theme/animations';
import { project, rubberband } from '@/theme/sheetMotion';
import {
  SCREEN_HEIGHT,
  DISMISS_THRESHOLD,
  VELOCITY_THRESHOLD,
  BACKDROP_OPACITY,
} from './constants';

const SHEET_TIMING_CONFIG = { duration: durations.sheet, easing: sheetEasing };
const BACKDROP_IN = { duration: durations.backdrop, easing: enterEasing };
const BACKDROP_OUT = { duration: durations.backdrop, easing: exitEasing };

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
        : withTiming(BACKDROP_OPACITY, BACKDROP_IN);
      translateY.value = reduceMotion ? 0 : withTiming(0, SHEET_TIMING_CONFIG);
    } else {
      backdropOpacity.value = reduceMotion ? 0 : withTiming(0, BACKDROP_OUT);
      translateY.value = reduceMotion
        ? SCREEN_HEIGHT
        : withTiming(SCREEN_HEIGHT, SHEET_TIMING_CONFIG);
    }
  }, [visible, reduceMotion, backdropOpacity, translateY]);

  // Pan gesture for drag-to-dismiss
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      'worklet';
      translateY.value =
        event.translationY >= 0
          ? event.translationY
          : rubberband(event.translationY, SCREEN_HEIGHT);
    })
    .onEnd((event) => {
      'worklet';
      const projected = translateY.value + project(event.velocityY);
      const shouldDismiss =
        event.translationY > DISMISS_THRESHOLD ||
        projected > DISMISS_THRESHOLD ||
        event.velocityY > VELOCITY_THRESHOLD;

      if (shouldDismiss) {
        translateY.value = withTiming(SCREEN_HEIGHT, SHEET_TIMING_CONFIG);
        scheduleOnRN(triggerLightImpact);
        scheduleOnRN(onClose);
      } else {
        translateY.value = withSpring(0, {
          ...springs.gesture,
          velocity: event.velocityY,
        });
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
