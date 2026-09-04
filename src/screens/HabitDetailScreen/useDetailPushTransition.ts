/**
 * useDetailPushTransition — habit detail screen push-in-from-right transition.
 *
 * A card `›` promises a push, not a sheet: the detail screen slides in from the
 * trailing edge (translateX) instead of sliding up from the bottom. Reduce Motion
 * swaps translateX for a cross-fade (pageOpacity) so users who disable motion
 * still get a clear state change without displacement.
 *
 * Enter: translateX SCREEN_WIDTH→0 + scrim fade-in, durations.enter / enterEasing.
 *        Reduce Motion: translateX snaps to 0, pageOpacity fades 0→1 instead.
 * Exit: translateX 0→SCREEN_WIDTH + scrim fade-out over 240ms, then unmount.
 *       Reduce Motion: pageOpacity fades 1→0 over 240ms, then unmount.
 * Re-entry: if `visible` flips back to true mid-exit, the enter timing simply
 *           replaces the running exit timing (Reanimated cancels in place) and
 *           `mounted` never goes false.
 */

import { useEffect, useRef, useState } from 'react';
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { durations, enterEasing } from '@/theme/animations';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { SCREEN_WIDTH } from '@/components/Modal/Modal.constants';

const EXIT_DURATION_MS = 240;

export function useDetailPushTransition(visible: boolean) {
  const [mounted, setMounted] = useState(visible);
  const translateX = useSharedValue(SCREEN_WIDTH);
  const scrim = useSharedValue(0);
  const pageOpacity = useSharedValue(1);
  const reduceMotion = useReduceMotion();
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      // First mount while hidden: stay at rest, no animation.
      if (!visible) return;
    }

    if (visible) {
      setMounted(true);
      scrim.value = withTiming(1, {
        duration: durations.enter,
        easing: enterEasing,
      });
      if (reduceMotion) {
        translateX.value = 0;
        pageOpacity.value = 0;
        pageOpacity.value = withTiming(1, {
          duration: durations.enter,
          easing: enterEasing,
        });
        return;
      }
      translateX.value = withTiming(0, {
        duration: durations.enter,
        easing: enterEasing,
      });
      return;
    }

    scrim.value = withTiming(0, {
      duration: EXIT_DURATION_MS,
      easing: enterEasing,
    });
    if (reduceMotion) {
      pageOpacity.value = withTiming(
        0,
        { duration: EXIT_DURATION_MS, easing: enterEasing },
        (finished) => {
          if (finished) runOnJS(setMounted)(false);
        }
      );
      return;
    }
    translateX.value = withTiming(
      SCREEN_WIDTH,
      { duration: EXIT_DURATION_MS, easing: enterEasing },
      (finished) => {
        if (finished) runOnJS(setMounted)(false);
      }
    );
  }, [visible, reduceMotion]);

  const pageStyle = useAnimatedStyle(() => ({
    opacity: pageOpacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  const scrimStyle = useAnimatedStyle(() => ({
    opacity: scrim.value,
  }));

  return { mounted, pageStyle, scrimStyle };
}
