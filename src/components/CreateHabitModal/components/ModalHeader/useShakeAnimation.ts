/**
 * Shake animation hook for validation errors
 */

import { Animated } from 'react-native';
import { useRef, useCallback } from 'react';

export const useShakeAnimation = (
  triggerWarning: () => void,
  onValidationError?: () => void
) => {
  const shakeValue = useRef(new Animated.Value(0)).current;

  const triggerShake = useCallback(() => {
    triggerWarning();
    onValidationError?.();

    Animated.sequence([
      Animated.timing(shakeValue, {
        duration: 50,
        toValue: 10,
        useNativeDriver: true,
      }),
      Animated.timing(shakeValue, {
        duration: 50,
        toValue: -10,
        useNativeDriver: true,
      }),
      Animated.timing(shakeValue, {
        duration: 50,
        toValue: 8,
        useNativeDriver: true,
      }),
      Animated.timing(shakeValue, {
        duration: 50,
        toValue: -8,
        useNativeDriver: true,
      }),
      Animated.timing(shakeValue, {
        duration: 50,
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, [shakeValue, triggerWarning, onValidationError]);

  return { shakeValue, triggerShake };
};
