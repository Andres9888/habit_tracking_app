/**
 * Name input section for habit customization
 * Dark mode aware via ThemedTextInput.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { ThemedTextInput } from '@/components/ui/ThemedTextInput';
import { useThemeColors } from '@/theme/ThemeContext';
import { styles } from './styles';
import type { NameInputProps } from './types';

export function NameInput({
  customName,
  disabled,
  onChangeName,
}: NameInputProps) {
  const theme = useAppTheme();
  const { colors } = useThemeColors();

  return (
    <View style={styles.section}>
      <Text
        style={[
          styles.label,
          { color: colors.text.secondary },
        ]}
      >
        Habit Name
      </Text>
      <ThemedTextInput
        accessibilityLabel='Habit name'
        editable={!disabled}
        placeholder='Enter habit name'
        placeholderTextColor={colors.text.tertiary}
        style={[
          styles.input,
          {
            backgroundColor: colors.gray[50],
            borderColor: colors.gray[200],
            color: colors.text.primary,
            fontFamily: theme.custom.fontFamilies.primary.text,
          },
        ]}
        value={customName}
        onChangeText={onChangeName}
      />
    </View>
  );
}
