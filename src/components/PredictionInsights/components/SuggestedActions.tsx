
import React from 'react';
import { View, Text } from 'react-native';

import type { AppTheme } from '../../../theme';
import { styles } from '../PredictionInsights.styles';

interface SuggestedActionsProps {
  suggestions: string[];
  theme: AppTheme;
}

export function SuggestedActions({
  suggestions,
  theme,
}: SuggestedActionsProps) {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <View style={styles.suggestionsContainer}>
      <Text
        style={[
          theme.custom.typography.bodyMedium,
          {
            color: theme.custom.colors.gray[900],
            fontWeight: '600',
            marginBottom: 8,
          },
        ]}
      >
        Suggested Actions
      </Text>
      {suggestions.map((suggestion, index) => (
        <View key={index} style={styles.suggestionItem}>
          <View
            style={[
              styles.bulletPoint,
              { backgroundColor: theme.custom.colors.primary[500] },
            ]}
          />
          <Text
            style={[
              theme.custom.typography.bodySmall,
              { color: theme.custom.colors.gray[700], flex: 1 },
            ]}
          >
            {suggestion}
          </Text>
        </View>
      ))}
    </View>
  );
}
