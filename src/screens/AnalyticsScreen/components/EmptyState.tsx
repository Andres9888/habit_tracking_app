/**
 * EmptyState - Shown when user has no habits to display analytics for
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';

export const EmptyState: React.FC = () => {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateEmoji}>📊</Text>
      <Text style={styles.emptyStateTitle}>No Analytics Yet</Text>
      <Text style={styles.emptyStateMessage}>
        Create habits and track them for a few days to see your analytics
        dashboard come to life!
      </Text>
      <View style={styles.emptyStateSteps}>
        <Text style={styles.emptyStateStep}>1️⃣ Go to Home tab</Text>
        <Text style={styles.emptyStateStep}>2️⃣ Create your first habit</Text>
        <Text style={styles.emptyStateStep}>3️⃣ Track it daily</Text>
        <Text style={styles.emptyStateStep}>
          4️⃣ Come back here to see insights!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
  },
  emptyStateEmoji: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyStateMessage: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
    textAlign: 'center',
  },
  emptyStateStep: {
    ...typography.body,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    paddingVertical: spacing.xs,
  },
  emptyStateSteps: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    width: '100%',
  },
  emptyStateTitle: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
});
