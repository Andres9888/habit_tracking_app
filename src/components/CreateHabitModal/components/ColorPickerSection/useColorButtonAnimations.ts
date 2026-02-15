
import { Animated } from 'react-native';
import { useCallback, useEffect, useRef } from 'react';

import { Motion } from '../../../../constants/motion';

interface UseColorButtonAnimationsParams {
  isSelected: boolean;
  reduceMotion: boolean;
}

export const useColorButtonAnimations = ({
  isSelected,
  reduceMotion,
}: UseColorButtonAnimationsParams) => {
  const scale = useRef(new Animated.Value(isSelected ? 1.08 : 1)).current;
  const rippleScale = useRef(new Animated.Value(0)).current;
  const rippleOpacity = useRef(new Animated.Value(1)).current;
  const wasSelected = useRef(isSelected);

  // Animate scale when selection changes
  useEffect(() => {
    if (isSelected !== wasSelected.current) {
      if (reduceMotion) {
        scale.setValue(isSelected ? 1.08 : 1);
      } else if (isSelected) {
        Animated.spring(scale, {
          damping: 12,
          stiffness: 180,
          toValue: 1.08,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.timing(scale, {
          duration: Motion.duration.base,
          easing: Motion.easing.outEase,
          toValue: 1,
          useNativeDriver: true,
        }).start();
      }
      wasSelected.current = isSelected;
    }
  }, [isSelected, scale, reduceMotion]);

  const triggerRipple = useCallback(() => {
    if (reduceMotion) return;

    rippleScale.setValue(0);
    rippleOpacity.setValue(1);

    Animated.parallel([
      Animated.timing(rippleScale, {
        duration: 300,
        easing: Motion.easing.outEase,
        toValue: 2,
        useNativeDriver: true,
      }),
      Animated.timing(rippleOpacity, {
        duration: 300,
        easing: Motion.easing.outEase,
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, [rippleScale, rippleOpacity, reduceMotion]);

  const animatePressIn = useCallback(() => {
    if (reduceMotion) return;
    Animated.timing(scale, {
      duration: Motion.duration.fast,
      easing: Motion.easing.inEase,
      toValue: isSelected ? 1.08 : 0.96,
      useNativeDriver: true,
    }).start();
  }, [isSelected, scale, reduceMotion]);

  const animatePressOut = useCallback(() => {
    if (reduceMotion) return;
    Animated.timing(scale, {
      duration: Motion.duration.base,
      easing: Motion.easing.outEase,
      toValue: isSelected ? 1.08 : 1,
      useNativeDriver: true,
    }).start();
  }, [isSelected, scale, reduceMotion]);

  return {
    animatePressIn,
    animatePressOut,
    rippleOpacity,
    rippleScale,
    scale,
    triggerRipple,
  };
};
