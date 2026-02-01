/**
 * Name input section for habit customization
 */

import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { useAppTheme } from '../../../theme';
import { styles } from './styles';
import type { NameInputProps } from './types';

export function NameInput({
  customName,
  disabled,
  onChangeName,
}: NameInputProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.section}>
      <Text
        style={[
          styles.label,
          { fontFamily: theme.custom.fontFamilies.primary.text },
        ]}
      >
        Habit Name
      </Text>
      <TextInput
        accessibilityLabel='Habit name'
        editable={!disabled}
        placeholder='Enter habit name'
        placeholderTextColor='#a8a29e'
        style={[
          styles.input,
          {
            backgroundColor: theme.custom.colors.light.background,
            borderColor: theme.custom.colors.gray[200],
            fontFamily: theme.custom.fontFamilies.primary.text,
          },
        ]}
        value={customName}
        onChangeText={onChangeName}
      />
    </View>
  );
}
