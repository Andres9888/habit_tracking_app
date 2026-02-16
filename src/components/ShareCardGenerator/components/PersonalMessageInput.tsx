/**
 * PersonalMessageInput Component
 * Text input for adding a personal message to the share card
 */

import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { useAppTheme } from '../../../theme';
import { controlsStyles as styles } from '../styles';
import { MESSAGE_MAX_LENGTH } from '../ShareCardGenerator.constants';
import { sanitizeMultilineText } from '../../../utils/inputSanitization';

interface PersonalMessageInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function PersonalMessageInput({
  value,
  onChangeText,
}: PersonalMessageInputProps) {
  const theme = useAppTheme();

  const handleTextChange = (text: string) => {
    const sanitized = sanitizeMultilineText(text);
    onChangeText(sanitized);
  };

  return (
    <View style={styles.optionGroup}>
      <Text
        style={[styles.optionLabel, { color: theme.custom.colors.gray[700] }]}
      >
        Personal Message (Optional)
      </Text>
      <TextInput
        multiline
        accessibilityLabel='Personal message, optional'
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
        returnKeyType='done'
        value={value}
        onChangeText={handleTextChange}
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
