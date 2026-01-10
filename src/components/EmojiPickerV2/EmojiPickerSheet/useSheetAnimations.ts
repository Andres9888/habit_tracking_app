/**
 * useSheetAnimations Hook
 * Manages bottom sheet animations and gesture handling
 */

import { useEffect, useCallback } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { SHEET_HEIGHT } from './EmojiPickerSheet.styles';

export function useSheetAnimations(visible: boolean, onClose: () => void) {
  const translateY = useSharedValue(SHEET_HEIGHT);
  const backdropOpacity = useSharedValue(0);
  const context = useSharedValue({ y: 0 });
  const searchFocusAnim = useSharedValue(0);

  // Sheet open/close animations
  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
      backdropOpacity.value = withTiming(1, { duration: 300 });
    } else {
      translateY.value = withSpring(SHEET_HEIGHT, {
        damping: 20,
        stiffness: 200,
      });
      backdropOpacity.value = withTiming(0, { duration: 300 });
    }
  }, [visible]);

  const closeSheet = useCallback(() => {
    translateY.value = withSpring(SHEET_HEIGHT, {
      damping: 20,
      stiffness: 200,
    });
    backdropOpacity.value = withTiming(0, { duration: 200 });
    setTimeout(onClose, 200);
  }, [onClose]);

  // Gesture handler for drag dismissal
  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = Math.max(context.value.y + event.translationY, 0);
    })
    .onEnd((event) => {
      const velocityY = Math.round(event.velocityY);
      if (translateY.value > SHEET_HEIGHT * 0.25 || velocityY > 500) {
        runOnJS(closeSheet)();
      } else {
        translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
      }
    });

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      backdropOpacity.value,
      [0, 1],
      [0, 0.4],
      Extrapolation.CLAMP
    ),
  }));

  const searchBarAnimatedStyle = useAnimatedStyle(() => ({
    borderColor: searchFocusAnim.value === 1 ? '#3b82f6' : '#e7e5e4',
    shadowColor: '#3b82f6',
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: interpolate(
      searchFocusAnim.value,
      [0, 1],
      [0, 0.2],
      Extrapolation.CLAMP
    ),
    shadowRadius: interpolate(
      searchFocusAnim.value,
      [0, 1],
      [0, 6],
      Extrapolation.CLAMP
    ),
  }));

  return {
    backdropAnimatedStyle,
    closeSheet,
    gesture,
    searchBarAnimatedStyle,
    searchFocusAnim,
    sheetAnimatedStyle,
  };
}
