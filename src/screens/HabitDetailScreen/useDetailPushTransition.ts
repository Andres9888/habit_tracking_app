/**
 * useDetailPushTransition — habit detail screen push-in-from-right transition.
 *
 * A card `›` promises a push, not a sheet: the detail screen slides in from the
 * trailing edge instead of sliding up from the bottom, and Home slides left
 * under it (see detailPushProgress). Reduce Motion swaps the slide for a
 * cross-fade so users who disable motion still get a clear state change.
 *
 * Everything reads one progress value (0 off-screen → 1 at rest), paced at
 * durations.sheet so this screen feels like every other modal surface.
 *
 * Enter: the page stays parked off-screen until the Modal reports `onShow`, so
 *        presentation and first layout don't eat the opening frames.
 * Exit:  progress 1→0 on moveEasing, then unmount. Content stays live until
 *        then — the caller gates data on `mounted`, not `visible`, so the page
 *        does not recolor or lose rows while it is still sliding out.
 * Re-entry mid-exit: the Modal is still shown, so enter starts immediately and
 *        replaces the running exit; `mounted` never goes false.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  withTiming,
} from 'react-native-reanimated';
import { durations, enterEasing, moveEasing } from '@/theme/animations';
import { SCREEN_WIDTH } from '@/components/Modal/Modal.constants';
import { detailPushProgress as progress } from './detailPushProgress';

/**
 * Peak scrim opacity. A push dims the screen underneath only lightly; the full
 * overlays.scrim strength reads as a sheet sitting on top of Home.
 */
const PUSH_SCRIM_OPACITY = 0.35;
const ENTER = { duration: durations.sheet, easing: enterEasing };
const EXIT = { duration: durations.sheet, easing: moveEasing };

export function useDetailPushTransition(visible: boolean) {
  const [mounted, setMounted] = useState(visible);
  const reduceMotion = useReducedMotion();
  const isFirstRun = useRef(true);
  const visibleRef = useRef(visible);
  const shown = useRef(false);
  visibleRef.current = visible;

  const startEnter = useCallback(() => {
    progress.value = withTiming(1, ENTER);
  }, []);

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

    progress.value = withTiming(0, EXIT, (finished?: boolean) => {
      'worklet';
      if (finished) runOnJS(unmount)();
    });
  }, [visible]);

  const onShow = useCallback(() => {
    shown.current = true;
    if (visibleRef.current) startEnter();
  }, [startEnter]);

  const pageStyle = useAnimatedStyle(() => {
    const p = progress.value;
    if (reduceMotion) return { opacity: p, transform: [{ translateX: 0 }] };
    return {
      opacity: 1,
      transform: [{ translateX: interpolate(p, [0, 1], [SCREEN_WIDTH, 0]) }],
    };
  });

  const scrimStyle = useAnimatedStyle(() => ({
    opacity: progress.value * PUSH_SCRIM_OPACITY,
  }));

  return { mounted, onShow, pageStyle, scrimStyle };
}
