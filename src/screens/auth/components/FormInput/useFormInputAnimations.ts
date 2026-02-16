import { useCallback, useState } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolateColor,
} from 'react-native-reanimated';
import { useThemeColors } from '../../../../theme/ThemeContext';

export function useFormInputAnimations() {
  const [isFocused, setIsFocused] = useState(false);
  const { isDark, colors: themeColors } = useThemeColors();
  const focusProgress = useSharedValue(0);

  // Use theme colors for focus state (brand color)
  const focusColor = themeColors.primary[500];

  // Dark/light default colors
  const defaultBg = isDark ? 'rgba(30, 30, 30, 0.5)' : themeColors.gray[50];
  const focusedBg = themeColors.card;
  const defaultBorder = themeColors.border;

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
      [defaultBorder, focusColor]
    ),

    elevation: focusProgress.value * 2,
    // Subtle shadow on focus
    shadowColor: focusColor,
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
