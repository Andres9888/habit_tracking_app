/**
 * useCardStrengthFill — Reanimated width for the watercolor fill background.
 *
 * Animates a `width: N%` style that drives the {@link StrengthFillBackground}
 * gradient behind the card content. The first render paints the resting
 * width instantly; later strength changes spring to the new value.
 *
 * Why no grow-in from 0%: Reanimated re-commits the first-render style
 * snapshot on every later React render. With a 0% snapshot, a dropped
 * settled-props registry entry (busy JS thread or app backgrounded during
 * the 1–2 s report window) makes the next re-render erase the fill. Seeding
 * the shared value with the real strength keeps the resting visual
 * React-owned, so the fill survives regardless of registry state.
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
  const fillWidth = useSharedValue(strengthPercent);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      // Already seeded at the resting width; nothing to animate.
      isFirstRender.current = false;
      return;
    }
    if (reduceMotion) {
      fillWidth.value = strengthPercent;
      return;
    }
    fillWidth.value = withSpring(strengthPercent, {
      ...springs.gentle,
      mass: 0.8,
    });
  }, [strengthPercent, reduceMotion, fillWidth]);

  const strengthFillStyle = useAnimatedStyle(() => ({
    width: `${fillWidth.value}%`,
  }));

  return { isDark, strengthFillStyle };
}
