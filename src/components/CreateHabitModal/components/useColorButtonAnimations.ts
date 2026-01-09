/**
 * Animation hooks for AnimatedColorButton.
 */

import { useCallback, useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { Motion } from '../../../constants/motion';

export function useColorButtonAnimations(isSelected: boolean) {
  const scale = useRef(new Animated.Value(1)).current;
  const wasSelected = useRef(isSelected);

  useEffect(() => {
    if (isSelected && !wasSelected.current) {
      Animated.sequence([
        Animated.timing(scale, {
          duration: Motion.duration.fast,
          easing: Motion.easing.outEase,
          toValue: 1.15,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          damping: 12,
          stiffness: 180,
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();
    }
    wasSelected.current = isSelected;
  }, [isSelected, scale]);

  const handlePressIn = useCallback(() => {
    Animated.timing(scale, {
      duration: Motion.duration.fast,
      easing: Motion.easing.inEase,
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const handlePressOut = useCallback(() => {
    Animated.timing(scale, {
      duration: Motion.duration.base,
      easing: Motion.easing.outEase,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return { handlePressIn, handlePressOut, scale };
}
