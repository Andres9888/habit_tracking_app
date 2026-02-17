/**
 * IntentionCard - Prompt for setting next week's intention
 */
import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import { useThemeColors } from '../../../theme/ThemeContext';

interface IntentionCardProps {
  intention: string;
  onIntentionChange: (text: string) => void;
  onSave: () => Promise<void>;
}

export function IntentionCard({ intention, onIntentionChange, onSave }: IntentionCardProps) {
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
        <Text style={[typography.heading2, { color: colors.text.primary, marginBottom: spacing.sm }]}>
          🎯 Set Your Intention
        </Text>
        
        <Text style={[typography.body, { color: colors.text.secondary, marginBottom: spacing.md }]}>
          What do you want to focus on next week?
        </Text>

        <TextInput
          value={intention}
          onChangeText={onIntentionChange}
          placeholder="e.g., Stay consistent with morning routine..."
          placeholderTextColor={colors.text.tertiary}
          multiline
          numberOfLines={3}
          style={[
            typography.body,
            styles.input,
            {
              backgroundColor: colors.background,
              color: colors.text.primary,
              borderColor: colors.border,
            },
          ]}
        />

        <Button
          mode="contained"
          onPress={onSave}
          disabled={!intention.trim()}
          style={styles.button}
          labelStyle={[typography.button, { color: '#FFFFFF' }]}
          buttonColor="#047857"
        >
          Save Intention
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
  input: {
    borderRadius: 12,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.md,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  button: {
    borderRadius: 12,
  },
});
