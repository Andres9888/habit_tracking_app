/**
 * Shake animation hook for validation errors
 */
import { useCallback } from 'react';
import {
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { durations } from '@/theme/animations';

export const useShakeAnimation = (
  triggerWarning: () => void,
  onValidationError?: () => void
) => {
  const shakeValue = useSharedValue(0);

  const triggerShake = useCallback(() => {
    triggerWarning();
    onValidationError?.();

    shakeValue.value = withSequence(
      withTiming(10, { duration: durations.micro }),
      withTiming(-10, { duration: durations.micro }),
      withTiming(8, { duration: durations.micro }),
      withTiming(-8, { duration: durations.micro }),
      withTiming(0, { duration: durations.micro })
    );
  }, [shakeValue, triggerWarning, onValidationError]);

  return { shakeValue, triggerShake };
};
