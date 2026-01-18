import { useCallback, useState } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolateColor,
} from 'react-native-reanimated';

// Emerald-500 for focus state (brand color)
const EMERALD_500 = '#10b981';
// Stone-200 for default border
const STONE_200 = '#e7e5e4';
// Stone-50/50 for default background (semi-transparent)
const STONE_50_BG = 'rgba(250, 250, 249, 0.5)';
// White for focused background
const WHITE_BG = '#ffffff';

export function useFormInputAnimations() {
  const [isFocused, setIsFocused] = useState(false);
  const focusProgress = useSharedValue(0);

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
      [STONE_50_BG, WHITE_BG]
    ),
    borderColor: interpolateColor(
      focusProgress.value,
      [0, 1],
      [STONE_200, EMERALD_500]
    ),

    elevation: focusProgress.value * 2,
    // Subtle shadow on focus
    shadowColor: EMERALD_500,
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
