/**
 * CenterAlertContent Component
 * Renders the center alert variant of the Modal
 */

import React from 'react';
import type { ViewStyle } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import { useAppTheme } from '../../theme';
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

  return (
    <Animated.View
      style={[
        styles.centerAlert,
        {
          backgroundColor: theme.custom.colors.light.background,
          borderRadius: theme.custom.borderRadius.large,
          ...theme.custom.shadows.modal,
        },
        animatedStyle,
        customStyle,
      ]}
    >
      {children}
    </Animated.View>
  );
}
