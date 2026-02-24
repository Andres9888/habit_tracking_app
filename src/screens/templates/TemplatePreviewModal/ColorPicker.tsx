/**
 * Color picker section for icon customization
 */

import React from 'react';
import { View, Text } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { useAppTheme } from '../../../theme';
import { useThemeColors } from '../../../theme/ThemeContext';
import { styles } from './styles';
import { ICON_COLORS } from './constants';
import type { ColorPickerProps } from './types';

/** Human-readable names for accessibility */
const COLOR_NAMES: Record<string, string> = {
  '#FF6B6B': 'Coral Red',
  '#4ECDC4': 'Teal',
  '#45B7D1': 'Sky Blue',
  '#96CEB4': 'Sage Green',
  '#FFEAA7': 'Warm Yellow',
  '#DFE6E9': 'Light Gray',
  '#A29BFE': 'Lavender',
  '#FD79A8': 'Pink',
};

export function ColorPicker({
  customColor,
  disabled,
  onSelectColor,
}: ColorPickerProps) {
  const theme = useAppTheme();
  const { colors } = useThemeColors();

  return (
    <View style={styles.section}>
      <Text
        style={[
          styles.label,
          {
            color: colors.text.secondary,
            fontFamily: theme.custom.fontFamilies.primary.text,
          },
        ]}
      >
        Icon Color
      </Text>
      <View style={styles.colorPickerContainer}>
        {ICON_COLORS.map((color) => {
          const isSelected = customColor === color;
          const colorName = COLOR_NAMES[color] || color;
          return (
            <AnimatedPressable
              key={color}
              accessibilityLabel={`${colorName}${isSelected ? ', selected' : ''}`}
              accessibilityRole='button'
              accessibilityState={{ selected: isSelected }}
              disabled={disabled}
              style={[
                styles.colorOption,
                {
                  backgroundColor: color,
                  borderColor: isSelected ? colors.text.primary : 'transparent',
                  borderWidth: isSelected ? 3 : 0,
                },
              ]}
              onPress={() => onSelectColor(color)}
            />
          );
        })}
      </View>
    </View>
  );
}
