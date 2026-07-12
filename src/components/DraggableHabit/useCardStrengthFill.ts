/**
 * useCardStrengthFill — Reanimated width for the watercolor fill background.
 *
 * Animates a `width: N%` style that drives the {@link StrengthFillBackground}
 * gradient behind the card content. First render uses a delayed ease-in;
 * subsequent changes use a spring.
 *
 * @returns `{ isDark, strengthFillStyle }`
 */

import { useEffect, useRef } from 'react';
import {
  Easing as ReanimatedEasing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
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
      isFirstRender.current = false;
      fillWidth.value = withDelay(
        200,
        withTiming(strengthPercent, {
          duration: 800,
          easing: ReanimatedEasing.out(ReanimatedEasing.cubic),
        })
      );
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
