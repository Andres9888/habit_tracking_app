/**
 * Modal header with title and close button
 */

import React from 'react';
import { View, Text } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../../theme';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '../../../theme/ThemeContext';
import { styles } from './styles';
import type { ModalHeaderProps } from './types';

export function ModalHeader({ disabled, onClose }: ModalHeaderProps) {
  const theme = useAppTheme();
  const { colors } = useThemeColors();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.header, { paddingTop: insets.top > 0 ? insets.top : 12 }]}
    >
      <Text
        style={[
          styles.headerTitle,
          {
            color: colors.text.primary,
            fontFamily: theme.custom.fontFamilies.primary.text,
          },
        ]}
      >
        Customize Habit
      </Text>
      <AnimatedPressable
        accessible
        accessibilityLabel='Close customize modal'
        accessibilityRole='button'
        disabled={disabled}
        style={[styles.closeButton, { backgroundColor: colors.gray[200] }]}
        onPress={onClose}
      >
        <X color={colors.text.secondary} size={iconSizes.large} strokeWidth={2.5} />
      </AnimatedPressable>
    </View>
  );
}
