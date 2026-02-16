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
import { useThemeColors } from '@/theme/ThemeContext';
import { TIMING_CONFIGS } from '../animations';

interface UseInputAnimationsParams {
  onFocus?: () => void;
  onBlur?: () => void;
}

export function useInputAnimations({
  onFocus,
  onBlur,
}: UseInputAnimationsParams) {
  const [isFocused, setIsFocused] = useState(false);
  const focusProgress = useSharedValue(0);
  const { triggerLightImpact } = useHapticFeedback();
  const { colors } = useThemeColors();

  const borderDefault = colors.border;
  const borderFocused = '#3B82F6'; // blue-500 focus ring works in both modes

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
      [borderDefault, borderFocused]
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
