import { useCallback, useState } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolateColor,
} from 'react-native-reanimated';
import { useThemeColors } from '@/theme/ThemeContext';

export function usePasswordInputAnimations() {
  const [isFocused, setIsFocused] = useState(false);
  const { colors, isDark } = useThemeColors();
  const focusProgress = useSharedValue(0);

  const defaultBg = isDark ? 'rgba(30, 30, 30, 0.5)' : 'rgba(250, 250, 249, 0.5)';
  const focusedBg = isDark ? colors.card : '#ffffff';
  const defaultBorder = colors.border;
  const focusBorderColor = colors.primary[500];

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    focusProgress.value = withTiming(1, {
      duration: 200,
      easing: Easing.out(Easing.ease),
    });
  }, [focusProgress]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    focusProgress.value = withTiming(0, {
      duration: 200,
      easing: Easing.out(Easing.ease),
    });
  }, [focusProgress]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      focusProgress.value,
      [0, 1],
      [defaultBg, focusedBg]
    ),
    borderColor: interpolateColor(
      focusProgress.value,
      [0, 1],
      [defaultBorder, focusBorderColor]
    ),

    elevation: focusProgress.value * 2,
    // Subtle emerald shadow on focus
    shadowColor: focusBorderColor,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: focusProgress.value * 0.15,
    shadowRadius: focusProgress.value * 4,
  }));

  return {
    animatedStyle,
    handleBlur,
    handleFocus,
    isFocused,
  };
}
