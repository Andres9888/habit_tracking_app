/**
 * useCardStrengthFill — Reanimated width for the watercolor fill background.
 *
 * Animates a `width: N%` style that drives the {@link StrengthFillBackground}
 * gradient behind the card content. First render paints the final width
 * instantly (no cold-start grow-in); subsequent changes use a spring.
 *
 * @returns `{ isDark, strengthFillStyle }`
 */

import { useEffect, useRef } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { springs } from '@/theme/animations';
import { useThemeColors } from '../../theme/ThemeContext';

export function useCardStrengthFill(
  strengthPercent: number,
  reduceMotion: boolean
) {
  const { isDark } = useThemeColors();
  const fillWidth = useSharedValue(0);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (reduceMotion) {
      fillWidth.value = strengthPercent;
    } else if (isFirstRender.current) {
      // First paint shows the final fill instantly — no cold-start grow-in.
      // Later strength changes still animate via the spring below.
      isFirstRender.current = false;
      fillWidth.value = strengthPercent;
    } else {
      fillWidth.value = withSpring(strengthPercent, {
        ...springs.gentle,
        mass: 0.8,
      });
    }
  }, [strengthPercent, reduceMotion, fillWidth]);

  const strengthFillStyle = useAnimatedStyle(() => ({
    width: `${fillWidth.value}%`,
  }));

  return { isDark, strengthFillStyle };
}
