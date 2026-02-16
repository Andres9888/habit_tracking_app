/**
 * Animation hooks for HabitInput
 */

import { useCallback, useState } from 'react';
import {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useHapticFeedback } from '../../../../../hooks/useHapticFeedback';
import { TIMING_CONFIGS } from '../animations';
import { useEmptyStateColors } from '../useEmptyStateColors';

interface UseInputAnimationsParams {
  onFocus?: () => void;
  onBlur?: () => void;
}

export function useInputAnimations({
  onFocus,
  onBlur,
}: UseInputAnimationsParams) {
  const colors = useEmptyStateColors();
  const [isFocused, setIsFocused] = useState(false);
  const focusProgress = useSharedValue(0);
  const { triggerLightImpact } = useHapticFeedback();

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    focusProgress.value = withTiming(1, TIMING_CONFIGS.inputFocus);
    triggerLightImpact();
    onFocus?.();
  }, [focusProgress, onFocus, triggerLightImpact]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    focusProgress.value = withTiming(0, TIMING_CONFIGS.inputFocus);
    onBlur?.();
  }, [focusProgress, onBlur]);

  const containerStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      focusProgress.value,
      [0, 1],
      [colors.inputBorder, colors.inputBorderFocused]
    ),
    shadowOpacity: focusProgress.value * 0.15,
  }));

  return {
    containerStyle,
    handleBlur,
    handleFocus,
    isFocused,
  };
}
