import { useEffect } from 'react';
import { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { durations, enterEasing, exitEasing } from '@/theme/animations';
import { useHapticFeedback } from '../../../../hooks/useHapticFeedback';
import type { HabitSortMode } from '../../types';
import { BACKDROP_VISIBLE_OPACITY, SCREEN_HEIGHT } from './constants';
import { SHEET_TIMING_CONFIG, useSortSheetGesture } from './useSortSheetGesture';

const BACKDROP_IN = { duration: durations.backdrop, easing: enterEasing };
const BACKDROP_OUT = { duration: durations.backdrop, easing: exitEasing };

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
        : withTiming(BACKDROP_VISIBLE_OPACITY, BACKDROP_IN);
      translateY.value = reduceMotion
        ? 0
        : withTiming(0, SHEET_TIMING_CONFIG);
    } else {
      backdropOpacity.value = reduceMotion
        ? 0
        : withTiming(0, BACKDROP_OUT);
      translateY.value = reduceMotion
        ? SCREEN_HEIGHT
        : withTiming(SCREEN_HEIGHT, SHEET_TIMING_CONFIG);
    }
  }, [visible, reduceMotion, backdropOpacity, translateY]);

  const panGesture = useSortSheetGesture({
    onDismiss: onClose,
    translateY,
    triggerLightImpact,
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
