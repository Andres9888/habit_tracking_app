/**
 * Recommended Templates Section
 * 
 * Shows smart template suggestions at the top of the templates browse screen
 * Based on user's existing habits
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColors } from '../../../theme';
import { typography } from '../../../theme/typography';
import { useSmartSuggestions } from '../../../hooks/useSmartSuggestions';
import { TemplateListCard } from '../views/TemplateListCard';
import type { Doc, Id } from '../../../../convex/_generated/dataModel';

interface RecommendedSectionProps {
  importingTemplateId: Id<'templates'> | null;
  onImport: (templateId: Id<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
}

export function RecommendedSection({
  importingTemplateId,
  onImport,
  onPreview,
}: RecommendedSectionProps) {
  const { colors } = useThemeColors();
  const { suggestions, isLoading } = useSmartSuggestions();

  // Don't show if loading or no suggestions
  // Note: We show on templates screen even if user has many habits
  // (different from the HabitSuggestions component which only shows when < 5 habits)
  if (isLoading || suggestions.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text
          style={[
            typography.title,
            { color: colors.text.primary },
            styles.title,
          ]}
        >
          Recommended for you
        </Text>
        <Text
          style={[
            typography.caption,
            { color: colors.text.secondary },
            styles.subtitle,
          ]}
        >
          Based on your habits
        </Text>
      </View>

      <View style={styles.cards}>
        {suggestions.map((template) => (
          <View key={template._id} style={styles.cardWrapper}>
            <TemplateListCard
              item={template}
              importingTemplateId={importingTemplateId}
              onImport={onImport}
              onPreview={onPreview}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 12,
  },
  cards: {
    marginTop: 12,
  },
  container: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 4,
  },
  subtitle: {
    marginTop: 2,
  },
  title: {
    fontWeight: '600',
  },
});
