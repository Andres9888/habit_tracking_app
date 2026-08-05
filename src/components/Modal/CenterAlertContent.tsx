/**
 * CenterAlertContent Component
 * Renders the center alert variant of the Modal
 */

import React from 'react';
import type { ViewStyle } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import { useAppTheme } from '../../theme';
import { useThemeColors } from '../../theme/ThemeContext';
import { styles } from './Modal.styles';

interface CenterAlertContentProps {
  children: React.ReactNode;
  animatedStyle: AnimatedStyle<ViewStyle>;
  customStyle?: ViewStyle;
}

export function CenterAlertContent({
  children,
  animatedStyle,
  customStyle,
}: CenterAlertContentProps) {
  const theme = useAppTheme();
  const { colors: themeColors } = useThemeColors();

  return (
    <Animated.View
      style={[
        styles.centerAlert,
        {
          backgroundColor: themeColors.surface,
          borderRadius: theme.custom.borderRadius.large,
          ...theme.custom.shadows.alert,
        },
        animatedStyle,
        customStyle,
      ]}
    >
      {children}
    </Animated.View>
  );
}
