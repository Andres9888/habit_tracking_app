import { useMemo, useRef } from 'react';
import { Animated, Dimensions, Keyboard, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  computeKeyboardOverlap,
  computeToastKeyboardClearance,
  TOAST_BOTTOM_GAP,
} from './toastKeyboardGeometry';
import { useToastKeyboardAnimation } from './useToastKeyboardAnimation';

interface ToastKeyboardPosition {
  bottom: number;
  translateY: Animated.AnimatedInterpolation<number>;
}

export function useToastKeyboardPosition(): ToastKeyboardPosition {
  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get('screen').height;
  const initialMetrics = Keyboard.metrics();
  const shouldLiftForKeyboard = Platform.OS === 'ios';
  const initialKeyboardOverlap = initialMetrics
    ? computeKeyboardOverlap(screenHeight, initialMetrics.screenY)
    : 0;
  const initialClearance = computeToastKeyboardClearance(
    insets.bottom,
    initialKeyboardOverlap,
    shouldLiftForKeyboard && Keyboard.isVisible()
  );
  const clearance = useRef(new Animated.Value(initialClearance)).current;
  useToastKeyboardAnimation({
    clearance,
    enabled: shouldLiftForKeyboard,
    initialClearance,
    insetBottom: insets.bottom,
    screenHeight,
  });
  const translateY = useMemo(
    () => Animated.multiply<number>(clearance, -1),
    [clearance]
  );
  return { bottom: insets.bottom + TOAST_BOTTOM_GAP, translateY };
}
