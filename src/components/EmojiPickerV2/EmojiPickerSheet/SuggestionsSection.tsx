/**
 * SuggestionsSection Component
 * Displays AI-suggested emojis for the habit name
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { SuggestionEmojiCell } from './SuggestionEmojiCell';

import { colors } from '../../../theme/colors';
import { borderRadius, spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';

interface SuggestionsSectionProps {
  habitName: string;
  suggestedEmojis: string[];
  selectedEmoji: string | null;
  onEmojiSelect: (emoji: string) => void;
}

export function SuggestionsSection({
  habitName,
  suggestedEmojis,
  selectedEmoji,
  onEmojiSelect,
}: SuggestionsSectionProps) {
  if (suggestedEmojis.length === 0) return null;

  return (
    <View style={suggestionStyles.container}>
      <View style={suggestionStyles.header}>
        <Sparkles color={colors.warning[500]} size={16} />
        <Text style={suggestionStyles.headerText}>
          Perfect for "{habitName}"
        </Text>
      </View>
      <View style={suggestionStyles.grid}>
        {suggestedEmojis.map((emoji) => (
          <SuggestionEmojiCell
            key={`suggested-${emoji}`}
            emoji={emoji}
            isSelected={selectedEmoji === emoji}
            onPress={() => onEmojiSelect(emoji)}
          />
        ))}
      </View>
    </View>
  );
}

export const suggestionStyles = StyleSheet.create({
  container: {
    backgroundColor: '#fef3c7',
    borderColor: '#fcd34d',
    borderRadius: borderRadius.large,
    borderWidth: 1,
    marginBottom: spacing.md,
    marginHorizontal: spacing.lg,
    padding: spacing.base,
  },
  grid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  headerText: {
    color: colors.warning[700],
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
});
