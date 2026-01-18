/**
 * PersonalMessageInput Component
 * Text input for adding a personal message to the share card
 */

import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { useAppTheme } from '../../../theme';
import { controlsStyles as styles } from '../styles';
import { MESSAGE_MAX_LENGTH } from '../ShareCardGenerator.constants';

interface PersonalMessageInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function PersonalMessageInput({
  value,
  onChangeText,
}: PersonalMessageInputProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.optionGroup}>
      <Text
        style={[styles.optionLabel, { color: theme.custom.colors.gray[700] }]}
      >
        Personal Message (Optional)
      </Text>
      <TextInput
        multiline
        maxLength={MESSAGE_MAX_LENGTH}
        placeholder='Add a personal touch...'
        placeholderTextColor={theme.custom.colors.gray[400]}
        style={[
          styles.messageInput,
          {
            backgroundColor: theme.custom.colors.gray[50],
            borderColor: theme.custom.colors.gray[200],
            color: theme.custom.colors.gray[900],
          },
        ]}
        value={value}
        onChangeText={onChangeText}
      />
      <Text
        style={[
          styles.characterCount,
          { color: theme.custom.colors.gray[500] },
        ]}
      >
        {value.length}/{MESSAGE_MAX_LENGTH}
      </Text>
    </View>
  );
}
