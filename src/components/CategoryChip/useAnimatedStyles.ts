/**
 * CategoryChip Animated Styles
 */

import {
  useAnimatedStyle,
  interpolateColor,
  type SharedValue,
} from 'react-native-reanimated';

import { hexToRgba } from './CategoryChip.constants';

interface UseAnimatedStylesParams {
  chipOpacity: SharedValue<number>;
  chipTranslateX: SharedValue<number>;
  pressScale: SharedValue<number>;
  selectionProgress: SharedValue<number>;
  primaryColor: string;
}

export function useAnimatedStyles({
  chipOpacity,
  chipTranslateX,
  pressScale,
  selectionProgress,
  primaryColor,
}: UseAnimatedStylesParams) {
  const containerStyle = useAnimatedStyle(() => ({
    opacity: chipOpacity.value,
    transform: [
      { translateX: chipTranslateX.value },
      { scale: pressScale.value },
    ],
  }));

  const backgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      selectionProgress.value,
      [0, 1],
      ['#ffffff', 'rgba(255,255,255,0)']
    ),
    borderColor: interpolateColor(
      selectionProgress.value,
      [0, 1],
      ['#e5e7eb', 'rgba(229,231,235,0)']
    ),
    borderWidth: 1.5 * (1 - selectionProgress.value),
  }));

  const gradientOpacity = useAnimatedStyle(() => ({
    opacity: selectionProgress.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      selectionProgress.value,
      [0, 1],
      ['#3D3833', '#ffffff']
    ),
  }));

  const primaryRgba = hexToRgba(primaryColor, 0.15);

  const countBgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      selectionProgress.value,
      [0, 1],
      [primaryRgba, 'rgba(255,255,255,0.25)']
    ),
  }));

  const countTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      selectionProgress.value,
      [0, 1],
      [primaryColor, '#ffffff']
    ),
  }));

  return {
    backgroundStyle,
    containerStyle,
    countBgStyle,
    countTextStyle,
    gradientOpacity,
    textStyle,
  };
}
