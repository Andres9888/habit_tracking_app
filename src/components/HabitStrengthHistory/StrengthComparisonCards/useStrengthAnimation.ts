/**
 * Hook for animating strength value progression
 */

import { useEffect, useState } from 'react';
import {
  Easing,
  runOnJS,
  useAnimatedProps,
  useAnimatedReaction,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { NUMBER_COUNT_UP_DURATION } from './constants';

interface UseStrengthAnimationParams {
  strength: number;
  circumference: number;
}

export function useStrengthAnimation({
  strength,
  circumference,
}: UseStrengthAnimationParams) {
  const shouldReduceMotion = useReducedMotion();
  const progress = useSharedValue(0);

  const [displayedValue, setDisplayedValue] = useState(
    shouldReduceMotion ? Math.round(strength) : 0
  );

  useAnimatedReaction(
    () => progress.value,
    (currentProgress) => {
      const currentValue = Math.round(currentProgress * 100);
      runOnJS(setDisplayedValue)(currentValue);
    },
    [progress]
  );

  useEffect(() => {
    if (shouldReduceMotion) {
      progress.value = strength / 100;
      setDisplayedValue(Math.round(strength));
      return;
    }

    progress.value = withTiming(strength / 100, {
      duration: NUMBER_COUNT_UP_DURATION,
      easing: Easing.out(Easing.cubic),
    });
  }, [strength, progress, shouldReduceMotion]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference * (1 - progress.value);
    return { strokeDashoffset };
  });

  return { animatedProps, displayedValue };
}
