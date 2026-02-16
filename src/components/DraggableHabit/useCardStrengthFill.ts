/**
 * useCardStrengthFill — Reanimated width for the watercolor fill background.
 *
 * Animates a `width: N%` style that drives the {@link StrengthFillBackground}
 * gradient behind the card content. First render uses a delayed ease-in;
 * subsequent changes use a spring. Reads `showGradientFill` from Convex settings
 * directly to avoid prop-threading through the component tree.
 *
 * @returns `{ isDark, showGradientFill, strengthFillStyle }`
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
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useThemeColors } from '../../theme/ThemeContext';

export function useCardStrengthFill(
  strengthPercent: number,
  reduceMotion: boolean
) {
  const { isDark } = useThemeColors();
  const settings = useQuery(api.settings.get);
  const showGradientFill = settings?.showGradientFill ?? true;
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
        damping: 12,
        mass: 0.8,
        stiffness: 80,
      });
    }
  }, [strengthPercent, reduceMotion, fillWidth]);

  const strengthFillStyle = useAnimatedStyle(() => ({
    width: `${fillWidth.value}%`,
  }));

  return { isDark, showGradientFill, strengthFillStyle };
}
