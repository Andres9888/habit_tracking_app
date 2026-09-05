/**
 * Shake animation hook for validation errors
 */
import { useCallback } from 'react';
import { useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

export const useShakeAnimation = (
  triggerWarning: () => void,
  onValidationError?: () => void
) => {
  const shakeValue = useSharedValue(0);

  const triggerShake = useCallback(() => {
    triggerWarning();
    onValidationError?.();

    shakeValue.value = withSequence(
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(8, { duration: 50 }),
      withTiming(-8, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  }, [shakeValue, triggerWarning, onValidationError]);

  return { shakeValue, triggerShake };
};
