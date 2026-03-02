/**
 * useEntranceAnimation Hook
 * Handles fade-in and slide animation when habit card appears
 */

import { useEffect } from 'react';
import type { SharedValue } from 'react-native-reanimated';
import { Easing, withTiming } from 'react-native-reanimated';

export function useEntranceAnimation(
  fade: SharedValue<number>,
  translateY: SharedValue<number>
) {
  useEffect(() => {
    const config = { duration: 320, easing: Easing.out(Easing.cubic) };
    fade.value = withTiming(1, config);
    translateY.value = withTiming(0, config);
  }, [fade, translateY]);
}
