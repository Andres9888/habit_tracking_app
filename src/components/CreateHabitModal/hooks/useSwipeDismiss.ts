/**
 * useSwipeDismiss — sheet transition with swipe-to-dismiss.
 *
 * Enter: timing slide-up + backdrop fade-in (durations.enter / enterEasing)
 * Exit: timing slide-down + backdrop fade-out, then onClose
 * Swipe: gesture tracking with proportional backdrop fade, haptic on threshold;
 *        partial-drag snap-back stays on springs.gesture (small correction).
 */

import { useCallback, useEffect, useRef } from 'react';
import { Keyboard } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { durations, enterEasing, springs } from '@/theme/animations';
import { HapticPatterns } from '@/utils/haptics/patterns';
import {
  DISMISS_THRESHOLD,
  SCREEN_HEIGHT,
  VELOCITY_THRESHOLD,
} from '@/components/Modal/Modal.constants';

const BACKDROP_TARGET = 0.5;

interface UseSwipeDismissProps {
  visible: boolean;
  onClose: () => void;
}

export function useSwipeDismiss({ visible, onClose }: UseSwipeDismissProps) {
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const backdropOpacity = useSharedValue(0);
  const isClosing = useRef(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Animate sheet up and backdrop in independently so the backdrop fades
  // in place instead of sliding with the sheet (prevents "backdrop coming up" flash).
  useEffect(() => {
    if (visible) {
      isClosing.current = false;
      translateY.value = withTiming(0, {
        duration: durations.enter,
        easing: enterEasing,
      });
      backdropOpacity.value = withTiming(BACKDROP_TARGET, {
        duration: durations.enter,
        easing: enterEasing,
      });
    }
  }, [visible]);

  const animateOut = useCallback(() => {
    if (isClosing.current) return;
    isClosing.current = true;
    Keyboard.dismiss();
    backdropOpacity.value = withTiming(0, { duration: 200 });
    translateY.value = withTiming(
      SCREEN_HEIGHT,
      { duration: durations.enter, easing: enterEasing },
      (finished) => {
        if (finished) runOnJS(onCloseRef.current)();
      }
    );
  }, []);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      'worklet';
      if (event.translationY > 0) {
        translateY.value = event.translationY;
        const progress = 1 - event.translationY / SCREEN_HEIGHT;
        backdropOpacity.value = Math.max(0, progress * BACKDROP_TARGET);
      }
    })
    .onEnd((event) => {
      'worklet';
      const shouldDismiss =
        translateY.value > DISMISS_THRESHOLD ||
        event.velocityY > VELOCITY_THRESHOLD;

      if (shouldDismiss) {
        runOnJS(HapticPatterns.tap)();
        runOnJS(animateOut)();
      } else {
        translateY.value = withSpring(0, springs.gesture);
        backdropOpacity.value = withTiming(BACKDROP_TARGET, { duration: 200 });
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  return { animateOut, backdropStyle, panGesture, sheetStyle };
}
