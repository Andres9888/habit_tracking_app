import { useCallback, useRef } from 'react';
import {
  cancelAnimation,
  Easing,
  type SharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { durations, springs } from '@/theme/animations';

export const DAY_TOGGLE_SCALE = {
  pressed: 0.94,
  releasePeak: 1.06,
  rest: 1,
} as const;

interface Params {
  buttonScale: SharedValue<number>;
  onPress: () => void;
  reduceMotion: boolean;
}

const pressEasing = Easing.out(Easing.cubic);

function stopAt(buttonScale: SharedValue<number>, target: number) {
  cancelAnimation(buttonScale);
  buttonScale.value = target;
}

export function runPressIn(scale: SharedValue<number>, reduceMotion: boolean) {
  cancelAnimation(scale);
  scale.value = reduceMotion
    ? DAY_TOGGLE_SCALE.rest
    : withTiming(DAY_TOGGLE_SCALE.pressed, {
        duration: durations.stagger,
        easing: pressEasing,
      });
}

export function runPressCancel(
  scale: SharedValue<number>,
  reduceMotion: boolean
) {
  cancelAnimation(scale);
  scale.value = reduceMotion
    ? DAY_TOGGLE_SCALE.rest
    : withSpring(DAY_TOGGLE_SCALE.rest, springs.responsive);
}

export function runPressPop(scale: SharedValue<number>, reduceMotion: boolean) {
  if (reduceMotion) {
    stopAt(scale, DAY_TOGGLE_SCALE.rest);
    return;
  }
  cancelAnimation(scale);
  scale.value = withSequence(
    withTiming(DAY_TOGGLE_SCALE.releasePeak, {
      duration: durations.stagger,
      easing: pressEasing,
    }),
    withSpring(DAY_TOGGLE_SCALE.rest, springs.responsive)
  );
}

export function useHabitDayToggleHandlers({
  buttonScale,
  onPress,
  reduceMotion,
}: Params) {
  const pressIdRef = useRef(0);
  const committedPressRef = useRef<number | null>(null);
  const handlePressIn = useCallback(() => {
    pressIdRef.current += 1;
    committedPressRef.current = null;
    runPressIn(buttonScale, reduceMotion);
  }, [buttonScale, reduceMotion]);
  const handlePressOut = useCallback(() => {
    const pressId = pressIdRef.current;
    queueMicrotask(() => {
      if (
        pressIdRef.current === pressId &&
        committedPressRef.current !== pressId
      ) {
        runPressCancel(buttonScale, reduceMotion);
      }
    });
  }, [buttonScale, reduceMotion]);
  const handlePress = useCallback(() => {
    committedPressRef.current = pressIdRef.current;
    runPressPop(buttonScale, reduceMotion);
    onPress();
  }, [buttonScale, onPress, reduceMotion]);
  return { handlePress, handlePressIn, handlePressOut };
}
