/**
 * FullScreenContent Component
 * Renders the full screen variant of the Modal with Apple-like animations
 */

import React from 'react';
import { View, type ViewStyle } from 'react-native';
import {
  GestureDetector,
  type GestureType,
} from 'react-native-gesture-handler';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import { useThemeColors } from '../../theme/ThemeContext';
import { styles } from './Modal.styles';
import { borderRadius } from '../../theme/spacing';

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
  const { colors: themeColors } = useThemeColors();

  return (
    <GestureDetector gesture={gesture}>
      <View collapsable={false} style={{ flex: 1 }}>
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
      </View>
    </GestureDetector>
  );
}
