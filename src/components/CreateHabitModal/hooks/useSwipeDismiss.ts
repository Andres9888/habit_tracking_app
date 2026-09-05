/**
 * useSwipeDismiss — sheet transition with swipe-to-dismiss.
 *
 * Enter/Exit: timing slide (durations.sheet / sheetEasing — the iOS sheet
 *        curve) + backdrop fade (durations.backdrop / enterEasing|exitEasing).
 *        Matches the cadence of every other bottom sheet in the app (Sort,
 *        DayHabits, EmojiPicker, QuickActions, Modal) so surfaces feel paced
 *        the same, even though Create/Edit render as a custom sheet rather
 *        than the shared `Modal` component.
 * Swipe: see `useSwipeDismissGesture` — velocity-aware release structured
 *        like `useNoteSheetGesture`.
 *
 * Why bottom-sheet (not native slide) for Create/Edit: focused secondary tasks
 * benefit from preserving context — you can see the dim habits list behind the
 * sheet. iOS HIG: bottom sheets for secondary tasks, full-screen for navigation.
 */

import { useCallback, useEffect, useRef } from 'react';
import { Keyboard } from 'react-native';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { durations, enterEasing, exitEasing, sheetEasing } from '@/theme/animations';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { SCREEN_HEIGHT } from '@/components/Modal/Modal.constants';
import {
  BACKDROP_TARGET,
  useSwipeDismissGesture,
} from './useSwipeDismissGesture';

const SHEET_TIMING_CONFIG = { duration: durations.sheet, easing: sheetEasing };
const BACKDROP_IN = { duration: durations.backdrop, easing: enterEasing };
const BACKDROP_OUT = { duration: durations.backdrop, easing: exitEasing };

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

  useEffect(() => {
    if (visible) {
      isClosing.current = false;
      if (reduceMotion) {
        translateY.value = 0;
        backdropOpacity.value = BACKDROP_TARGET;
        return;
      }
      translateY.value = withTiming(0, SHEET_TIMING_CONFIG);
      backdropOpacity.value = withTiming(BACKDROP_TARGET, BACKDROP_IN);
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
    backdropOpacity.value = withTiming(0, BACKDROP_OUT);
    translateY.value = withTiming(
      SCREEN_HEIGHT,
      SHEET_TIMING_CONFIG,
      (finished) => {
        if (finished) scheduleOnRN(onCloseRef.current);
      }
    );
  }, [reduceMotion]);

  const panGesture = useSwipeDismissGesture({
    backdropOpacity,
    onDismiss: animateOut,
    translateY,
  });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  return { animateOut, backdropStyle, panGesture, sheetStyle };
}
