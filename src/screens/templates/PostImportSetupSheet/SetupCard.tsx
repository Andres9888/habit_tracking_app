/**
 * Individual setup card for the post-import setup sheet
 */

import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { fontFamilies, fontWeights } from '@/theme/typography';

interface SetupCardProps {
  emoji: string;
  title: string;
  description: string;
  placeholder: string;
  value: string;
  suggestedValue?: string;
  onChangeText: (text: string) => void;
  accentColor: string;
}

export function SetupCard({
  emoji,
  title,
  description,
  placeholder,
  value,
  suggestedValue,
  onChangeText,
  accentColor,
}: SetupCardProps) {
  const { colors } = useThemeColors();
  const hasSuggestion = !!suggestedValue && !value;

  return (
    <View
      style={[
        cardStyles.card,
        {
          backgroundColor: colors.card,
          borderColor: value ? accentColor : colors.border,
        },
      ]}
    >
      <View style={cardStyles.header}>
        <Text style={cardStyles.emoji}>{emoji}</Text>
        <View style={cardStyles.headerText}>
          <Text style={[cardStyles.title, { color: colors.text }]}>
            {title}
          </Text>
          <Text
            style={[cardStyles.description, { color: colors.textSecondary }]}
          >
            {description}
          </Text>
        </View>
      </View>

      {hasSuggestion && (
        <Text
          style={[cardStyles.suggestion, { color: accentColor }]}
          onPress={() => onChangeText(suggestedValue)}
        >
          {`Tap to use: "${suggestedValue}"`}
        </Text>
      )}

      <TextInput
        multiline
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        style={[
          cardStyles.input,
          {
            backgroundColor: `${accentColor}10`,
            borderColor: `${accentColor}30`,
            color: colors.text,
          },
        ]}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 14,
  },
  description: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 12,
    lineHeight: 16,
  },
  emoji: {
    fontSize: 22,
  },
  header: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    fontFamily: fontFamilies.primary.text,
    fontSize: 14,
    maxHeight: 80,
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
    textAlignVertical: 'top',
  },
  suggestion: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 12,
    fontWeight: fontWeights.medium,
    marginBottom: 8,
  },
  title: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 14,
    fontWeight: fontWeights.bold,
  },
});
