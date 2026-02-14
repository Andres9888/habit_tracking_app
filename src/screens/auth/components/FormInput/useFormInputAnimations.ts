import { useCallback, useState } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolateColor,
} from 'react-native-reanimated';

// Focus accent
const EMERALD_500 = '#10b981';
const EMERALD_DARK = '#34D399';

// Light mode
const STONE_200 = '#e7e5e4';
const STONE_50_BG = 'rgba(250, 250, 249, 0.5)';
const WHITE_BG = '#ffffff';

// Dark mode
const DARK_BORDER = '#374151';
const DARK_BG = '#1F2937';
const DARK_BG_FOCUS = '#111827';

interface UseFormInputAnimationsOptions {
  isDark?: boolean;
}

export function useFormInputAnimations({ isDark = false }: UseFormInputAnimationsOptions = {}) {
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

  const animatedStyle = useAnimatedStyle(() => {
    const bgFrom = isDark ? DARK_BG : STONE_50_BG;
    const bgTo = isDark ? DARK_BG_FOCUS : WHITE_BG;
    const borderFrom = isDark ? DARK_BORDER : STONE_200;
    const borderTo = isDark ? EMERALD_DARK : EMERALD_500;

    return {
      backgroundColor: interpolateColor(
        focusProgress.value,
        [0, 1],
        [bgFrom, bgTo]
      ),
      borderColor: interpolateColor(
        focusProgress.value,
        [0, 1],
        [borderFrom, borderTo]
      ),
      elevation: focusProgress.value * 2,
      shadowColor: borderTo,
      shadowOffset: { height: 2, width: 0 },
      shadowOpacity: focusProgress.value * 0.15,
      shadowRadius: focusProgress.value * 4,
    };
  });

  return {
    animatedStyle,
    handleBlur,
    handleFocus,
    isFocused,
  };
}
