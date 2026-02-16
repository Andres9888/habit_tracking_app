/**
 * useSheetAnimations Hook
 * Manages bottom sheet animations and gesture handling
 */

import { useEffect, useCallback, useRef } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import {
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import {
  SHEET_HEIGHT_COLLAPSED,
  SHEET_HEIGHT_EXPANDED,
} from './EmojiPickerSheet.styles';
import { useSheetStyles } from './useSheetStyles';

const SPRING_CONFIG = { damping: 20, stiffness: 200 };
const DISMISS_THRESHOLD = 0.25;
const DISMISS_VELOCITY = 500;

export function useSheetAnimations(visible: boolean, onClose: () => void) {
  const translateY = useSharedValue(SHEET_HEIGHT_EXPANDED);
  const backdropOpacity = useSharedValue(0);
  const context = useSharedValue({ y: 0 });
  const searchFocusAnim = useSharedValue(0);
  const sheetHeight = useSharedValue(SHEET_HEIGHT_COLLAPSED);

  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const animatedStyles = useSheetStyles(
    translateY,
    backdropOpacity,
    searchFocusAnim
  );

  // Cleanup close timer on unmount
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (visible) {
      sheetHeight.value = SHEET_HEIGHT_COLLAPSED;
      const offset = SHEET_HEIGHT_EXPANDED - SHEET_HEIGHT_COLLAPSED;
      translateY.value = withSpring(offset, SPRING_CONFIG);
      backdropOpacity.value = withTiming(1, { duration: 300 });
    } else {
      translateY.value = withSpring(SHEET_HEIGHT_EXPANDED, SPRING_CONFIG);
      backdropOpacity.value = withTiming(0, { duration: 300 });
    }
  }, [visible]);

  const closeSheet = useCallback(() => {
    translateY.value = withSpring(SHEET_HEIGHT_EXPANDED, SPRING_CONFIG);
    backdropOpacity.value = withTiming(0, { duration: 200 });
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(onClose, 200);
  }, [onClose]);

  const expandSheet = useCallback(() => {
    sheetHeight.value = SHEET_HEIGHT_EXPANDED;
    translateY.value = withSpring(0, SPRING_CONFIG);
  }, []);

  const collapseSheet = useCallback(() => {
    sheetHeight.value = SHEET_HEIGHT_COLLAPSED;
    const offset = SHEET_HEIGHT_EXPANDED - SHEET_HEIGHT_COLLAPSED;
    translateY.value = withSpring(offset, SPRING_CONFIG);
  }, []);

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = Math.max(context.value.y + event.translationY, 0);
    })
    .onEnd((event) => {
      const velocityY = Math.round(event.velocityY);
      const threshold = SHEET_HEIGHT_EXPANDED * DISMISS_THRESHOLD;
      if (translateY.value > threshold || velocityY > DISMISS_VELOCITY) {
        runOnJS(closeSheet)();
      } else {
        const offset = SHEET_HEIGHT_EXPANDED - sheetHeight.value;
        translateY.value = withSpring(offset, SPRING_CONFIG);
      }
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
