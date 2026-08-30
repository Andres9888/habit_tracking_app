/**
 * useEntranceAnimation Hook
 * Handles fade-in and slide animation when habit card appears.
 *
 * `mountVisible` cards start at their resting values instead of animating
 * 0 → 1. A card mounted during a heavy commit (the focus remount of a long
 * list) can have its first animated prop update dropped and stay invisible
 * until some later style update repaints it — the "blank card next to the
 * target" symptom. Mounting visible needs no update at all.
 */

import { useEffect } from 'react';
import type { SharedValue } from 'react-native-reanimated';
import { Easing, withTiming } from 'react-native-reanimated';
import { durations } from '@/theme/animations';

export function useEntranceAnimation(
  fade: SharedValue<number>,
  translateY: SharedValue<number>,
  reduceMotion: boolean,
  mountVisible = false
) {
  useEffect(() => {
    if (reduceMotion || mountVisible) {
      fade.value = 1;
      translateY.value = 0;
      return;
    }
    const config = {
      duration: durations.enter,
      easing: Easing.out(Easing.cubic),
    };
    fade.value = withTiming(1, config);
    translateY.value = withTiming(0, config);
  }, [fade, translateY, reduceMotion, mountVisible]);
}
