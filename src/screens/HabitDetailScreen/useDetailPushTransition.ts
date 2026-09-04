/**
 * useDetailPushTransition — habit detail screen push-in-from-right transition.
 *
 * A card `›` promises a push, not a sheet: the detail screen slides in from the
 * trailing edge (translateX) instead of sliding up from the bottom. Reduce Motion
 * swaps translateX for a cross-fade (pageOpacity) so users who disable motion
 * still get a clear state change without displacement.
 *
 * Enter: the page stays parked off-screen until the Modal reports `onShow`, so
 *        the first frames of the slide are not lost to presentation and first
 *        layout. Then translateX SCREEN_WIDTH→0 + scrim fade-in over
 *        durations.enter / enterEasing. Reduce Motion: pageOpacity fades 0→1.
 * Exit: translateX 0→SCREEN_WIDTH + scrim fade-out over durations.transition /
 *       exitEasing, then unmount. Reduce Motion: pageOpacity fades 1→0.
 * Re-entry: if `visible` flips back to true mid-exit the Modal is still shown,
 *           so the enter timing starts immediately and replaces the running
 *           exit timing (Reanimated cancels in place); `mounted` never goes false.
 *
 * The scrim is a sibling of the page, not its parent: a parent opacity would
 * fade the page itself and force an offscreen composite of the shadowed page
 * on every frame.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { durations, enterEasing, exitEasing } from '@/theme/animations';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { SCREEN_WIDTH } from '@/components/Modal/Modal.constants';

/**
 * Peak scrim opacity. A push dims the screen underneath only lightly; the full
 * overlays.scrim strength reads as a sheet sitting on top of home.
 */
const PUSH_SCRIM_OPACITY = 0.3;
const ENTER = { duration: durations.enter, easing: enterEasing };
const EXIT = { duration: durations.transition, easing: exitEasing };

export function useDetailPushTransition(visible: boolean) {
  const [mounted, setMounted] = useState(visible);
  const translateX = useSharedValue(SCREEN_WIDTH);
  const scrim = useSharedValue(0);
  const pageOpacity = useSharedValue(1);
  const reduceMotion = useReduceMotion();
  const isFirstRun = useRef(true);
  const visibleRef = useRef(visible);
  const shown = useRef(false);
  visibleRef.current = visible;

  const startEnter = useCallback(() => {
    scrim.value = withTiming(PUSH_SCRIM_OPACITY, ENTER);
    if (reduceMotion) {
      translateX.value = 0;
      pageOpacity.value = 0;
      pageOpacity.value = withTiming(1, ENTER);
      return;
    }
    pageOpacity.value = 1;
    translateX.value = withTiming(0, ENTER);
  }, [reduceMotion]);

  const unmount = useCallback(() => {
    shown.current = false;
    setMounted(false);
  }, []);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      // First mount while hidden: stay at rest, no animation.
      if (!visible) return;
    }

    if (visible) {
      setMounted(true);
      // Fresh presentation waits for onShow; re-entry mid-exit starts now.
      if (shown.current) startEnter();
      return;
    }

    scrim.value = withTiming(0, EXIT);
    const onDone = (finished?: boolean) => {
      'worklet';
      if (finished) runOnJS(unmount)();
    };
    if (reduceMotion) {
      pageOpacity.value = withTiming(0, EXIT, onDone);
      return;
    }
    translateX.value = withTiming(SCREEN_WIDTH, EXIT, onDone);
  }, [visible, reduceMotion]);

  const onShow = useCallback(() => {
    shown.current = true;
    if (visibleRef.current) startEnter();
  }, [startEnter]);

  const pageStyle = useAnimatedStyle(() => ({
    opacity: pageOpacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  const scrimStyle = useAnimatedStyle(() => ({
    opacity: scrim.value,
  }));

  return { mounted, onShow, pageStyle, scrimStyle };
}
