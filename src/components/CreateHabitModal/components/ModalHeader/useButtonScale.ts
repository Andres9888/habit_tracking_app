/**
 * Button scale animation hook
 */
import { useRef, useCallback } from 'react';
import { Animated } from 'react-native';
import { Motion } from '../../../../constants/motion';

export const useButtonScale = () => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.timing(scale, {
      duration: Motion.duration.fast,
      easing: Motion.easing.inEase,
      toValue: 0.96,
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
};
