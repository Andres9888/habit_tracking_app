import { useCallback } from 'react';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { durations, enterEasing, exitEasing } from '@/theme/animations';

interface UseColorButtonAnimationsParams {
  reduceMotion: boolean;
}

export const useColorButtonAnimations = ({
  reduceMotion,
}: UseColorButtonAnimationsParams) => {
  const scale = useSharedValue(1);
  const rippleScale = useSharedValue(0);
  const rippleOpacity = useSharedValue(1);

  const triggerRipple = useCallback(() => {
    if (reduceMotion) return;

    rippleScale.value = 0;
    rippleOpacity.value = 1;

    rippleScale.value = withTiming(2, {
      duration: durations.moderate,
      easing: enterEasing,
    });
    rippleOpacity.value = withTiming(0, {
      duration: durations.moderate,
      easing: enterEasing,
    });
  }, [rippleScale, rippleOpacity, reduceMotion]);

  const animatePressIn = useCallback(() => {
    if (reduceMotion) return;
    scale.value = withTiming(0.96, {
      duration: durations.instant,
      easing: exitEasing,
    });
  }, [scale, reduceMotion]);

  const animatePressOut = useCallback(() => {
    if (reduceMotion) return;
    scale.value = withTiming(1, {
      duration: durations.quick,
      easing: enterEasing,
    });
  }, [scale, reduceMotion]);

  return {
    animatePressIn,
    animatePressOut,
    rippleOpacity,
    rippleScale,
    scale,
    triggerRipple,
  };
};
