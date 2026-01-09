/**
 * Path drawing animation hook for StrengthTimelineChart
 */

import { useEffect } from 'react';
import {
  Easing,
  useAnimatedProps,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {
  ESTIMATED_PATH_LENGTH,
  MIN_HISTORY_LENGTH,
  PATH_ANIMATION_DURATION,
} from './constants';

interface UsePathAnimationProps {
  historyLength: number;
}

export function usePathAnimation({ historyLength }: UsePathAnimationProps) {
  const shouldReduceMotion = useReducedMotion();
  const pathProgress = useSharedValue(shouldReduceMotion ? 1 : 0);

  useEffect(() => {
    if (shouldReduceMotion || historyLength < MIN_HISTORY_LENGTH) {
      pathProgress.value = 1;
      return;
    }

    pathProgress.value = 0;
    pathProgress.value = withTiming(1, {
      duration: PATH_ANIMATION_DURATION,
      easing: Easing.out(Easing.cubic),
    });
  }, [shouldReduceMotion, historyLength, pathProgress]);

  const animatedLineProps = useAnimatedProps(() => {
    const strokeDashoffset = ESTIMATED_PATH_LENGTH * (1 - pathProgress.value);
    return { strokeDashoffset };
  });

  return { animatedLineProps, shouldReduceMotion };
}
