/**
 * useSheetStyles Hook
 * Animated styles for the emoji picker bottom sheet
 */

import {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { colors } from '../../../theme/colors';

export function useSheetStyles(
  translateY: SharedValue<number>,
  backdropOpacity: SharedValue<number>,
  searchFocusAnim: SharedValue<number>
) {
  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      backdropOpacity.value,
      [0, 1],
      [0, 1],
      Extrapolation.CLAMP
    ),
  }));

  const searchBarAnimatedStyle = useAnimatedStyle(() => ({
    borderColor:
      searchFocusAnim.value === 1 ? colors.secondary[500] : colors.border,
    shadowColor: colors.secondary[500],
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: interpolate(
      searchFocusAnim.value,
      [0, 1],
      [0, 0.2],
      Extrapolation.CLAMP
    ),
    shadowRadius: interpolate(
      searchFocusAnim.value,
      [0, 1],
      [0, 6],
      Extrapolation.CLAMP
    ),
  }));

  return { backdropAnimatedStyle, searchBarAnimatedStyle, sheetAnimatedStyle };
}
