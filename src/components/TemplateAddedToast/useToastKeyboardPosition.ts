import { useEffect, useMemo, useRef, useState } from 'react';
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

/**
 * Keyboard metrics are reported in screen coordinates, so the overlap math
 * must track the screen height across rotation — a stale portrait height
 * would misplace the toast in landscape.
 */
function useScreenHeight(): number {
  const [screenHeight, setScreenHeight] = useState(
    () => Dimensions.get('screen').height
  );
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ screen }) => {
      setScreenHeight(screen.height);
    });
    return () => subscription.remove();
  }, []);
  return screenHeight;
}

export function useToastKeyboardPosition(): ToastKeyboardPosition {
  const insets = useSafeAreaInsets();
  const screenHeight = useScreenHeight();
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
