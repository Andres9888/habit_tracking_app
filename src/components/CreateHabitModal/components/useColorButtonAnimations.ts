/**
 * Animation hooks for AnimatedColorButton.
 */

import { useCallback, useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import {
  durations,
  enterEasing,
  exitEasing,
  springs,
} from '@/theme/animations';

export function useColorButtonAnimations(isSelected: boolean) {
  const scale = useRef(new Animated.Value(1)).current;
  const wasSelected = useRef(isSelected);

  useEffect(() => {
    if (isSelected && !wasSelected.current) {
      Animated.sequence([
        Animated.timing(scale, {
          duration: durations.instant,
          easing: enterEasing,
          toValue: 1.15,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          ...springs.standard,
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();
    }
    wasSelected.current = isSelected;
  }, [isSelected, scale]);

  const handlePressIn = useCallback(() => {
    Animated.timing(scale, {
      duration: durations.instant,
      easing: exitEasing,
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const handlePressOut = useCallback(() => {
    Animated.timing(scale, {
      duration: durations.quick,
      easing: enterEasing,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return { handlePressIn, handlePressOut, scale };
}
