/**
 * OPTIMIZED: useCardStrengthFill
 * 
 * Uses shared SettingsContext instead of duplicate query
 * 
 * Performance improvements:
 * - Eliminates duplicate settings.get query
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
import { useSettings } from '../../contexts/SettingsContext';
import { useThemeColors } from '../../theme/ThemeContext';

export function useCardStrengthFill(
  strengthPercent: number,
  reduceMotion: boolean
) {
  const { isDark } = useThemeColors();
  
  // Use shared settings context instead of duplicate query
  const { settings } = useSettings();
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
