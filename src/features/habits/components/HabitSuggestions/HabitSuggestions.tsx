/**
 * Habit Suggestions Section
 * 
 * Shows smart template suggestions based on user's existing habits
 * Displayed in habits list header when user has 1-4 habits
 */

import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { useThemeColors } from '../../../../theme';
import { typography } from '../../../../theme/typography';
import { useSmartSuggestions } from '../../../../hooks/useSmartSuggestions';
import { SuggestionCard } from './SuggestionCard';
import type { Id } from '../../../../../convex/_generated/dataModel';

export function HabitSuggestions() {
  const { colors, isDark } = useThemeColors();
  const { suggestions, shouldShow, isLoading } = useSmartSuggestions();
  const [importingTemplateId, setImportingTemplateId] = useState<Id<'templates'> | null>(null);
  
  const importTemplate = useMutation(api.templates.importTemplate);
  
  const handleImport = useCallback(async (templateId: Id<'templates'>) => {
    try {
      setImportingTemplateId(templateId);
      await importTemplate({ templateId });
      // Success - the habit will appear in the list automatically via Convex reactivity
    } catch (error) {
      console.error('Failed to import template:', error);
    } finally {
      setImportingTemplateId(null);
    }
  }, [importTemplate]);

  if (isLoading || !shouldShow || suggestions.length === 0) {
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
          Suggested for you
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

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {suggestions.map((template, index) => (
          <SuggestionCard
            key={template._id}
            template={template}
            index={index}
            isImporting={importingTemplateId === template._id}
            isDark={isDark}
            onImport={() => handleImport(template._id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  scrollView: {
    marginHorizontal: -20,
  },
  subtitle: {
    marginTop: 2,
  },
  title: {
    fontWeight: '600',
  },
});
