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
import { useHapticFeedback } from '../../../../hooks/useHapticFeedback';
import type { HabitSortMode } from '../../types';
import {
  BACKDROP_FADE_IN_DURATION_MS,
  BACKDROP_FADE_OUT_DURATION_MS,
  BACKDROP_VISIBLE_OPACITY,
  DISMISS_THRESHOLD,
  SCREEN_HEIGHT,
  VELOCITY_THRESHOLD,
} from './constants';

const SHEET_TIMING_CONFIG = { duration: durations.sheet, easing: enterEasing };

interface UseSortBottomSheetOptions {
  visible: boolean;
  reduceMotion: boolean;
  onClose: () => void;
  onSelectSortMode: (mode: HabitSortMode) => void;
}

export function useSortBottomSheet({
  visible,
  reduceMotion,
  onClose,
  onSelectSortMode,
}: UseSortBottomSheetOptions) {
  const { triggerSelection, triggerLightImpact } = useHapticFeedback({});

  const translateY = useSharedValue(SCREEN_HEIGHT);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      backdropOpacity.value = reduceMotion
        ? BACKDROP_VISIBLE_OPACITY
        : withTiming(BACKDROP_VISIBLE_OPACITY, {
            duration: BACKDROP_FADE_IN_DURATION_MS,
            easing: Easing.out(Easing.cubic),
          });
      translateY.value = reduceMotion
        ? 0
        : withTiming(0, SHEET_TIMING_CONFIG);
    } else {
      backdropOpacity.value = reduceMotion
        ? 0
        : withTiming(0, {
            duration: BACKDROP_FADE_OUT_DURATION_MS,
            easing: Easing.in(Easing.cubic),
          });
      translateY.value = reduceMotion
        ? SCREEN_HEIGHT
        : withTiming(SCREEN_HEIGHT, SHEET_TIMING_CONFIG);
    }
  }, [visible, reduceMotion, backdropOpacity, translateY]);

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

  const handleSelectSort = (mode: HabitSortMode) => {
    triggerSelection();
    onSelectSortMode(mode);
    onClose();
  };

  const handleDismiss = () => {
    triggerLightImpact();
    onClose();
  };

  return {
    backdropStyle,
    handleDismiss,
    handleSelectSort,
    panGesture,
    sheetStyle,
  };
}
