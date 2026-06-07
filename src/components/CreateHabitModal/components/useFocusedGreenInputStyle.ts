import { useEffect } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const FOCUS_GREEN = '#10B981';
const ERROR_RED = '#EF4444';
const DEFAULT_BORDER = '#e7e5e4';

/** Emerald border + soft glow while the habit name field is focused. */
export function useFocusedGreenInputStyle(
  isFocused: boolean,
  hasError: boolean,
  defaultBorderColor: string = DEFAULT_BORDER
) {
  const focusProgress = useSharedValue(0);

  useEffect(() => {
    focusProgress.value = withTiming(isFocused && !hasError ? 1 : 0, {
      duration: 200,
    });
  }, [focusProgress, hasError, isFocused]);

  return useAnimatedStyle(
    () => ({
      borderColor: hasError
        ? ERROR_RED
        : focusProgress.value > 0.5
          ? FOCUS_GREEN
          : defaultBorderColor,
      borderWidth: 2,
      elevation: focusProgress.value * 2,
      shadowColor: FOCUS_GREEN,
      shadowOffset: { height: 0, width: 0 },
      shadowOpacity: focusProgress.value * 0.1,
      shadowRadius: focusProgress.value * 3,
    }),
    [defaultBorderColor, hasError]
  );
}
