/**
 * FullScreenContent Component
 * Renders the full screen variant of the Modal with Apple-like animations
 */

import React from 'react';
import type { ViewStyle } from 'react-native';

import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import {
  GestureDetector,
  type GestureType,
} from 'react-native-gesture-handler';

import { borderRadius } from '../../theme/spacing';
import { styles } from './Modal.styles';
import { useAppTheme } from '../../theme';
import { useThemeColors } from '../../theme/ThemeContext';

interface FullScreenContentProps {
  children: React.ReactNode;
  gesture: GestureType;
  animatedStyle: AnimatedStyle<ViewStyle>;
  customStyle?: ViewStyle;
}

export function FullScreenContent({
  children,
  gesture,
  animatedStyle,
  customStyle,
}: FullScreenContentProps) {
  const theme = useAppTheme();
  const { colors: themeColors } = useThemeColors();

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          styles.fullScreen,
          {
            backgroundColor: themeColors.surface,
            borderTopLeftRadius: borderRadius.medium,
            borderTopRightRadius: borderRadius.medium,
          },
          animatedStyle,
          customStyle,
        ]}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  );
}
