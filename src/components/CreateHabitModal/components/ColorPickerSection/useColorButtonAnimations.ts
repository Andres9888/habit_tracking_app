import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';
import { durations, enterEasing, exitEasing } from '@/theme/animations';

interface UseColorButtonAnimationsParams {
  reduceMotion: boolean;
}

export const useColorButtonAnimations = ({
  reduceMotion,
}: UseColorButtonAnimationsParams) => {
  const scale = useRef(new Animated.Value(1)).current;
  const rippleScale = useRef(new Animated.Value(0)).current;
  const rippleOpacity = useRef(new Animated.Value(1)).current;

  const triggerRipple = useCallback(() => {
    if (reduceMotion) return;

    rippleScale.setValue(0);
    rippleOpacity.setValue(1);

    Animated.parallel([
      Animated.timing(rippleScale, {
        duration: durations.moderate,
        easing: enterEasing,
        toValue: 2,
        useNativeDriver: true,
      }),
      Animated.timing(rippleOpacity, {
        duration: durations.moderate,
        easing: enterEasing,
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, [rippleScale, rippleOpacity, reduceMotion]);

  const animatePressIn = useCallback(() => {
    if (reduceMotion) return;
    Animated.timing(scale, {
      duration: durations.instant,
      easing: exitEasing,
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  }, [scale, reduceMotion]);

  const animatePressOut = useCallback(() => {
    if (reduceMotion) return;
    Animated.timing(scale, {
      duration: durations.quick,
      easing: enterEasing,
      toValue: 1,
      useNativeDriver: true,
    }).start();
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
