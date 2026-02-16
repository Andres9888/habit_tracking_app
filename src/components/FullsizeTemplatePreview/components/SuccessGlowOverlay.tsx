/**
 * SuccessGlowOverlay - Green success glow effect
 */

import React from 'react';
import Animated from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import { useLayoutStyles } from '../styles';
import type { ViewStyle } from 'react-native';

interface SuccessGlowOverlayProps {
  animatedStyle: ViewStyle;
}

export function SuccessGlowOverlay({ animatedStyle }: SuccessGlowOverlayProps) {
  const { colors } = useThemeColors();
  const layout = useLayoutStyles();

  return (
    <Animated.View
      pointerEvents='none'
      style={[
        layout.successGlowOverlay,
        { backgroundColor: colors.success[500] },
        animatedStyle,
      ]}
    />
  );
}
