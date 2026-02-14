/**
 * PersonalMessageInput Component
 * Text input for adding a personal message to the share card.
 * Dark mode aware via ThemedTextInput.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { ThemedTextInput } from '@/components/ui/ThemedTextInput';
import { useThemeColors } from '@/theme/ThemeContext';
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
  const { colors } = useThemeColors();

  return (
    <View style={styles.optionGroup}>
      <Text
        style={[styles.optionLabel, { color: colors.text.secondary }]}
      >
        Personal Message (Optional)
      </Text>
      <ThemedTextInput
        multiline
        accessibilityLabel='Personal message, optional'
        maxLength={MESSAGE_MAX_LENGTH}
        placeholder='Add a personal touch...'
        style={{ minHeight: 80, textAlignVertical: 'top' }}
        value={value}
        onChangeText={onChangeText}
      />
      <Text
        style={[
          styles.characterCount,
          { color: colors.text.tertiary },
        ]}
      >
        {value.length}/{MESSAGE_MAX_LENGTH}
      </Text>
    </View>
  );
}
