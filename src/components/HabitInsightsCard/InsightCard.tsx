/**
 * InsightCard - Individual insight display card
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import type { InsightCardProps } from './HabitInsightsCard.types';

export const InsightCard: React.FC<InsightCardProps> = ({
  insight,
  backgroundColor,
}) => {
  return (
    <View style={[styles.card, { backgroundColor }]}>
      <Text style={styles.emoji}>{insight.emoji}</Text>
      <Text style={styles.title}>{insight.title}</Text>
      <Text style={styles.message}>{insight.message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    minWidth: 200,
    padding: spacing.md,
    width: 220,
  },
  emoji: {
    fontSize: 28,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.caption,
    fontWeight: '600',
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  message: {
    ...typography.body,
    lineHeight: 22,
  },
});
