/**
 * useSheetAnimations Hook
 * Manages bottom sheet animations and gesture handling
 */

import { useCallback, useEffect } from 'react';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import {
  durations,
  enterEasing,
  exitEasing,
  sheetEasing,
} from '@/theme/animations';
import {
  SHEET_HEIGHT_COLLAPSED,
  SHEET_HEIGHT_EXPANDED,
} from './EmojiPickerSheet.styles';
import { useEmojiSheetGesture } from './useEmojiSheetGesture';
import { useSheetStyles } from './useSheetStyles';

const SHEET_TIMING_CONFIG = { duration: durations.sheet, easing: sheetEasing };
const BACKDROP_IN = { duration: durations.backdrop, easing: enterEasing };
const BACKDROP_OUT = { duration: durations.backdrop, easing: exitEasing };

export function useSheetAnimations(visible: boolean, onClose: () => void) {
  const translateY = useSharedValue(SHEET_HEIGHT_EXPANDED);
  const backdropOpacity = useSharedValue(0);
  const context = useSharedValue({ y: 0 });
  const searchFocusAnim = useSharedValue(0);
  const sheetHeight = useSharedValue(SHEET_HEIGHT_COLLAPSED);

  const animatedStyles = useSheetStyles(
    translateY,
    backdropOpacity,
    searchFocusAnim
  );

  useEffect(() => {
    if (visible) {
      sheetHeight.value = SHEET_HEIGHT_COLLAPSED;
      const offset = SHEET_HEIGHT_EXPANDED - SHEET_HEIGHT_COLLAPSED;
      translateY.value = withTiming(offset, SHEET_TIMING_CONFIG);
      backdropOpacity.value = withTiming(1, BACKDROP_IN);
    } else {
      translateY.value = withTiming(SHEET_HEIGHT_EXPANDED, SHEET_TIMING_CONFIG);
      backdropOpacity.value = withTiming(0, BACKDROP_OUT);
    }
  }, [visible]);

  const closeSheet = useCallback(() => {
    backdropOpacity.value = withTiming(0, BACKDROP_OUT);
    translateY.value = withTiming(
      SHEET_HEIGHT_EXPANDED,
      SHEET_TIMING_CONFIG,
      (finished) => {
        if (finished) scheduleOnRN(onClose);
      }
    );
  }, [onClose]);

  const expandSheet = useCallback(() => {
    sheetHeight.value = SHEET_HEIGHT_EXPANDED;
    translateY.value = withTiming(0, SHEET_TIMING_CONFIG);
  }, []);

  const collapseSheet = useCallback(() => {
    sheetHeight.value = SHEET_HEIGHT_COLLAPSED;
    const offset = SHEET_HEIGHT_EXPANDED - SHEET_HEIGHT_COLLAPSED;
    translateY.value = withTiming(offset, SHEET_TIMING_CONFIG);
  }, []);

  const gesture = useEmojiSheetGesture({
    context,
    expandedHeight: SHEET_HEIGHT_EXPANDED,
    onDismiss: closeSheet,
    sheetHeight,
    translateY,
  });

  return {
    ...animatedStyles,
    closeSheet,
    collapseSheet,
    expandSheet,
    gesture,
    searchFocusAnim,
  };
}
