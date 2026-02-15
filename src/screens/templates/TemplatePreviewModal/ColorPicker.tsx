/**
 * Color picker section for icon customization
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';

import type { ColorPickerProps } from './types';
import { ICON_COLORS } from './constants';
import { styles } from './styles';
import { useAppTheme } from '../../../theme';

export function ColorPicker({
  customColor,
  disabled,
  onSelectColor,
}: ColorPickerProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.section}>
      <Text
        style={[
          styles.label,
          { fontFamily: theme.custom.fontFamilies.primary.text },
        ]}
      >
        Icon Color
      </Text>
      <View style={styles.colorPickerContainer}>
        {ICON_COLORS.map((color) => (
          <Pressable
            key={color}
            accessibilityLabel={`${color} color`}
            accessibilityRole='button'
            accessibilityState={{ selected: customColor === color }}
            disabled={disabled}
            style={[
              styles.colorOption,
              {
                backgroundColor: color,
                borderColor: customColor === color ? '#1F2937' : 'transparent',
                borderWidth: customColor === color ? 3 : 0,
              },
            ]}
            onPress={() => onSelectColor(color)}
          />
        ))}
      </View>
    </View>
  );
}
