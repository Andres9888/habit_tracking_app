/**
 * Name input section for habit customization
 */

import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { buildTextInputHintProps } from '@/utils/textInputHintProps';
import { useAppTheme } from '../../../theme';
import { useThemeColors } from '../../../theme/ThemeContext';
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
          {
            color: colors.text.secondary,
            fontFamily: theme.custom.fontFamilies.primary.text,
          },
        ]}
      >
        Habit Name
      </Text>
      <TextInput
        accessibilityLabel='Habit name'
        editable={!disabled}
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
        {...buildTextInputHintProps('Enter habit name', colors.text.tertiary)}
        onChangeText={onChangeName}
      />
    </View>
  );
}
