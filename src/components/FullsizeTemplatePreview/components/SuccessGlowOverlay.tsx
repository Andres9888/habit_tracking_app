/**
 * SuccessGlowOverlay - Green success glow effect
 */

import React from 'react';
import Animated from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import { createLayoutStyles } from '../styles';
import type { ViewStyle } from 'react-native';

interface SuccessGlowOverlayProps {
  animatedStyle: ViewStyle;
}

export function SuccessGlowOverlay({ animatedStyle }: SuccessGlowOverlayProps) {
  const { colors } = useThemeColors();
  const layoutStyles = React.useMemo(
    () => createLayoutStyles(colors),
    [colors],
  );

  return (
    <Animated.View
      pointerEvents='none'
      style={[
        layoutStyles.successGlowOverlay,
        { backgroundColor: colors.success.primary },
        animatedStyle,
      ]}
    />
  );
}
