/**
 * useSwipeDismiss — sheet transition with swipe-to-dismiss.
 *
 * Enter: timing slide-up + backdrop fade-in (durations.sheet / enterEasing).
 *        Uses `durations.sheet` (~360ms) to match the cadence of the native
 *        iOS Modal slide animation used by Settings and Templates — all
 *        modal surfaces feel paced the same, even though Create/Edit are
 *        bottom sheets rather than full-screen modals.
 * Exit: timing slide-down + backdrop fade-out, then onClose.
 * Swipe: gesture tracking with proportional backdrop fade, haptic on threshold;
 *        partial-drag snap-back stays on springs.gesture (small correction).
 *
 * Why bottom-sheet (not native slide) for Create/Edit: focused secondary tasks
 * benefit from preserving context — you can see the dim habits list behind the
 * sheet. iOS HIG: bottom sheets for secondary tasks, full-screen for navigation.
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
import { useReduceMotion } from '@/hooks/useReduceMotion';
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
  const reduceMotion = useReduceMotion();

  // Sheet and backdrop arrive together on the canonical 280ms cubic ease-out
  // (design system rule: "Entry motion: fade + translateY, 280ms cubic ease-out,
  // no springify"). Matches DayHabitsBottomSheet / EmojiPickerV2 — calm, no
  // overshoot wobble. With reduce-motion enabled, snap directly to final state.
  useEffect(() => {
    if (visible) {
      isClosing.current = false;
      if (reduceMotion) {
        translateY.value = 0;
        backdropOpacity.value = BACKDROP_TARGET;
        return;
      }
      translateY.value = withTiming(0, {
        duration: durations.sheet,
        easing: enterEasing,
      });
      backdropOpacity.value = withTiming(BACKDROP_TARGET, {
        duration: durations.sheet,
        easing: enterEasing,
      });
    }
  }, [visible, reduceMotion]);

  const animateOut = useCallback(() => {
    if (isClosing.current) return;
    isClosing.current = true;
    Keyboard.dismiss();
    if (reduceMotion) {
      backdropOpacity.value = 0;
      translateY.value = SCREEN_HEIGHT;
      onCloseRef.current();
      return;
    }
    // Backdrop and sheet exit on the same duration so the dim doesn't disappear
    // before the sheet has finished sliding away.
    backdropOpacity.value = withTiming(0, {
      duration: durations.sheet,
      easing: enterEasing,
    });
    translateY.value = withTiming(
      SCREEN_HEIGHT,
      { duration: durations.sheet, easing: enterEasing },
      (finished) => {
        if (finished) runOnJS(onCloseRef.current)();
      }
    );
  }, [reduceMotion]);

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
        backdropOpacity.value = withTiming(BACKDROP_TARGET, { duration: durations.standard });
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
