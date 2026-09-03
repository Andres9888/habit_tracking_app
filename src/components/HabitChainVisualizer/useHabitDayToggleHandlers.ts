import { useCallback, useRef } from 'react';
import {
  cancelAnimation,
  Easing,
  type SharedValue,
  withTiming,
} from 'react-native-reanimated';

import { durations } from '@/theme/animations';

export const DAY_TOGGLE_SCALE = {
  pressed: 0.97,
  rest: 1,
} as const;

interface Params {
  buttonScale: SharedValue<number>;
  onPress: () => void;
  reduceMotion: boolean;
}

const pressEasing = Easing.bezier(0.23, 1, 0.32, 1);

function stopAt(buttonScale: SharedValue<number>, target: number) {
  cancelAnimation(buttonScale);
  buttonScale.value = target;
}

export function runPressIn(scale: SharedValue<number>, reduceMotion: boolean) {
  cancelAnimation(scale);
  scale.value = reduceMotion
    ? DAY_TOGGLE_SCALE.rest
    : withTiming(DAY_TOGGLE_SCALE.pressed, {
        duration: durations.instant,
        easing: pressEasing,
      });
}

function runPressRelease(scale: SharedValue<number>, reduceMotion: boolean) {
  if (reduceMotion) {
    stopAt(scale, DAY_TOGGLE_SCALE.rest);
    return;
  }
  cancelAnimation(scale);
  scale.value = withTiming(DAY_TOGGLE_SCALE.rest, {
    duration: durations.instant,
    easing: pressEasing,
  });
}

export function runPressCancel(
  scale: SharedValue<number>,
  reduceMotion: boolean
) {
  runPressRelease(scale, reduceMotion);
}

export function useHabitDayToggleHandlers({
  buttonScale,
  onPress,
  reduceMotion,
}: Params) {
  const pressInCountRef = useRef(0);
  const pressOutCountRef = useRef(0);
  const handlePressIn = useCallback(() => {
    pressInCountRef.current += 1;
    runPressIn(buttonScale, reduceMotion);
  }, [buttonScale, reduceMotion]);
  const handlePressOut = useCallback(() => {
    const pressId = ++pressOutCountRef.current;
    if (pressInCountRef.current > pressId) return;
    runPressCancel(buttonScale, reduceMotion);
  }, [buttonScale, reduceMotion]);
  const handlePress = useCallback(() => {
    onPress();
  }, [onPress]);
  return { handlePress, handlePressIn, handlePressOut };
}
