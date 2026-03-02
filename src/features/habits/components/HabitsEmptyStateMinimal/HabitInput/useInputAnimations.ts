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
import { useThemeColors } from '../../../../../theme/ThemeContext';
import { colors as appColors } from '../../../../../theme/colors';
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
  const { colors, isDark } = useThemeColors();
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
      [colors.border, isDark ? colors.primary[400] : appColors.secondary[500]]
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
