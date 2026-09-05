import { useEffect, useState } from 'react';
import { Dimensions, Keyboard, Platform } from 'react-native';
import { useDerivedValue, useSharedValue, type SharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  computeKeyboardOverlap,
  computeToastKeyboardClearance,
  TOAST_BOTTOM_GAP,
} from './toastKeyboardGeometry';
import { useToastKeyboardAnimation } from './useToastKeyboardAnimation';

interface ToastKeyboardPosition {
  bottom: number;
  translateY: SharedValue<number>;
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
  const clearance = useSharedValue(initialClearance);
  useToastKeyboardAnimation({
    clearance,
    enabled: shouldLiftForKeyboard,
    initialClearance,
    insetBottom: insets.bottom,
    screenHeight,
  });
  const translateY = useDerivedValue(() => clearance.value * -1);
  return { bottom: insets.bottom + TOAST_BOTTOM_GAP, translateY };
}
