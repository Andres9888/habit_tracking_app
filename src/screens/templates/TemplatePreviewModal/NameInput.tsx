/**
 * Name input section for habit customization
 */

import React from 'react';
import { View, Text, TextInput, Keyboard } from 'react-native';

import type { NameInputProps } from './types';
import { styles } from './styles';
import { useAppTheme } from '../../../theme';

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
        returnKeyType='done'
        value={customName}
        onChangeText={onChangeName}
        onSubmitEditing={Keyboard.dismiss}
      />
    </View>
  );
}
