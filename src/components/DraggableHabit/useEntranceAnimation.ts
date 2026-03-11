/**
 * useEntranceAnimation Hook
 * Handles fade-in and slide animation when habit card appears
 */

import { useEffect } from 'react';
import type { SharedValue } from 'react-native-reanimated';
import { Easing, withTiming } from 'react-native-reanimated';
import { durations } from '@/theme/animations';

export function useEntranceAnimation(
  fade: SharedValue<number>,
  translateY: SharedValue<number>,
  reduceMotion: boolean
) {
  useEffect(() => {
    if (reduceMotion) {
      fade.value = 1;
      translateY.value = 0;
      return;
    }
    const config = { duration: durations.enter, easing: Easing.out(Easing.cubic) };
    fade.value = withTiming(1, config);
    translateY.value = withTiming(0, config);
  }, [fade, translateY, reduceMotion]);
}
