/**
 * SuccessGlowOverlay - Green success glow effect
 */

import React from 'react';
import Animated from 'react-native-reanimated';
import { layoutStyles } from '../styles';
import { useThemeColors } from '@/theme/ThemeContext';
import type { ViewStyle } from 'react-native';

interface SuccessGlowOverlayProps {
  animatedStyle: ViewStyle;
}

export function SuccessGlowOverlay({ animatedStyle }: SuccessGlowOverlayProps) {
  const { colors } = useThemeColors();

  return (
    <Animated.View
      pointerEvents='none'
      style={[
        layoutStyles.successGlowOverlay,
        { backgroundColor: colors.status.success },
        animatedStyle,
      ]}
    />
  );
}
