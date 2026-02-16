/**
 * useCountingPercent - Animates a percentage number counting up/down
 * Uses Reanimated shared values for smooth 60fps counting animation
 */

import { useState, useEffect, useRef } from 'react';
import {
  useSharedValue,
  useDerivedValue,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

export function useCountingPercent(target: number) {
  const [display, setDisplay] = useState(0);
  const animValue = useSharedValue(0);
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      animValue.value = withDelay(
        200,
        withTiming(target, {
          duration: 800,
          easing: Easing.out(Easing.cubic),
        })
      );
    } else {
      animValue.value = withTiming(target, {
        duration: 500,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [target]);

  useDerivedValue(() => {
    'worklet';
    const v = animValue.value;
    const rounded =
      typeof v === 'number' && !Number.isNaN(v) ? Math.round(v) : 0;
    runOnJS(setDisplay)(rounded);
    return rounded;
  }, [animValue]);

  return display;
}
