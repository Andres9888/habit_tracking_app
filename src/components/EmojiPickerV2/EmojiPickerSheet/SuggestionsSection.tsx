/**
 * SuggestionsSection Component
 * Displays AI-suggested emojis for the habit name
 * Theme-aware with dark mode support
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { SuggestionEmojiCell } from './SuggestionEmojiCell';

import { colors } from '../../../theme/colors';
import { borderRadius, spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';
import type { SemanticColors } from '../../../theme/darkColors';

interface SuggestionsSectionProps {
  habitName: string;
  suggestedEmojis: string[];
  selectedEmoji: string | null;
  onEmojiSelect: (emoji: string) => void;
  themeColors: SemanticColors;
  isDark: boolean;
}

export function SuggestionsSection({
  habitName,
  suggestedEmojis,
  selectedEmoji,
  onEmojiSelect,
  themeColors,
  isDark,
}: SuggestionsSectionProps) {
  if (suggestedEmojis.length === 0) return null;

  const containerBg = isDark ? themeColors.gray[100] : colors.warning[100];
  const containerBorder = isDark ? themeColors.gray[200] : colors.warning[300];
  const headerTextColor = isDark ? colors.streak[300] : colors.warning[700];

  return (
    <View
      style={[
        suggestionStyles.container,
        { backgroundColor: containerBg, borderColor: containerBorder },
      ]}
    >
      <View style={suggestionStyles.header}>
        <Sparkles color={isDark ? colors.streak[300] : colors.warning[500]} size={16} />
        <Text style={[suggestionStyles.headerText, { color: headerTextColor }]}>
          Perfect for "{habitName}"
        </Text>
      </View>
      <View style={suggestionStyles.grid}>
        {suggestedEmojis.map((emoji) => (
          <SuggestionEmojiCell
            key={`suggested-${emoji}`}
            emoji={emoji}
            isSelected={selectedEmoji === emoji}
            themeColors={themeColors}
            onPress={() => onEmojiSelect(emoji)}
          />
        ))}
      </View>
    </View>
  );
}

export const suggestionStyles = StyleSheet.create({
  container: {
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
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
});
