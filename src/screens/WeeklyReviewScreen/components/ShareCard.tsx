/**
 * ShareCard - Shareable summary card
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import { useThemeColors } from '../../../theme/ThemeContext';

interface ShareCardProps {
  completionRate: number;
  totalCompletions: number;
  weekNumber: number;
  onShare: () => void;
}

export function ShareCard({ completionRate, totalCompletions, weekNumber, onShare }: ShareCardProps) {
  const { colors } = useThemeColors();

  return (
    <Card
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          elevation: 4,
        },
      ]}
    >
      <Card.Content>
        <Text style={[typography.heading2, { color: colors.text.primary, marginBottom: spacing.md }]}>
          📤 Share Your Progress
        </Text>
        
        <View style={styles.previewContainer}>
          <View style={[styles.preview, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={[typography.heading3, { color: colors.text.primary, textAlign: 'center' }]}>
              Week {weekNumber} Review
            </Text>
            <Text style={[typography.displayLarge, { color: '#047857', textAlign: 'center', marginVertical: spacing.sm }]}>
              {Math.round(completionRate)}%
            </Text>
            <Text style={[typography.body, { color: colors.text.secondary, textAlign: 'center' }]}>
              {totalCompletions} habits completed
            </Text>
          </View>
        </View>

        <Button
          mode="outlined"
          onPress={onShare}
          style={[styles.button, { borderColor: '#047857' }]}
          labelStyle={[typography.button, { color: '#047857' }]}
        >
          Share Summary
        </Button>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: spacing.md,
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  preview: {
    borderRadius: 12,
    borderWidth: 2,
    padding: spacing.lg,
    width: '100%',
  },
  button: {
    borderRadius: 12,
    borderWidth: 2,
  },
});
