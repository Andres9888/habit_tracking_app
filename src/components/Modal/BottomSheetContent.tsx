/**
 * BottomSheetContent Component
 * Renders the bottom sheet variant of the Modal
 */

import React from 'react';
import { View, type ViewStyle } from 'react-native';

import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import {
  GestureDetector,
  type GestureType,
} from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { styles } from './Modal.styles';
import { useAppTheme } from '../../theme';
import { useThemeColors } from '../../theme/ThemeContext';

interface BottomSheetContentProps {
  children: React.ReactNode;
  gesture: GestureType;
  animatedStyle: AnimatedStyle<ViewStyle>;
  customStyle?: ViewStyle;
}

export function BottomSheetContent({
  children,
  gesture,
  animatedStyle,
  customStyle,
}: BottomSheetContentProps) {
  const theme = useAppTheme();
  const { colors: themeColors } = useThemeColors();
  const insets = useSafeAreaInsets();

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          styles.bottomSheet,
          {
            backgroundColor: themeColors.surface,
            borderTopLeftRadius: theme.custom.borderRadius.large,
            borderTopRightRadius: theme.custom.borderRadius.large,
            paddingBottom: insets.bottom,
            ...theme.custom.shadows.modal,
          },
          animatedStyle,
          customStyle,
        ]}
      >
        {/* Pull indicator */}
        <View style={styles.pullIndicatorContainer}>
          <View
            style={[
              styles.pullIndicator,
              { backgroundColor: theme.custom.colors.gray[300] },
            ]}
          />
        </View>
        {children}
      </Animated.View>
    </GestureDetector>
  );
}
