/**
 * PremiumLockOverlay - Premium feature lock overlay
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import type { PremiumLockOverlayProps } from './HabitInsightsCard.types';

export const PremiumLockOverlay: React.FC<PremiumLockOverlayProps> = ({
  onUnlockPress,
}) => {
  return (
    <View style={styles.overlay}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="lock-closed" size={32} color={colors.primary[500]} />
        </View>
        <Text style={styles.title}>Unlock Personalized Insights</Text>
        <Text style={styles.description}>
          Get AI-powered tips based on your habit patterns — best days, optimal
          times, and streak insights.
        </Text>
        <TouchableOpacity style={styles.button} onPress={onUnlockPress}>
          <Ionicons name="star" size={16} color={colors.surface} />
          <Text style={styles.buttonText}>Unlock with Premium</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    alignItems: 'center',
    backgroundColor: `${colors.surface}F2`,
    borderRadius: 12,
    padding: spacing.xl,
  },
  content: {
    alignItems: 'center',
    maxWidth: 280,
  },
  iconContainer: {
    backgroundColor: colors.primary[50],
    borderRadius: 32,
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  title: {
    ...typography.heading3,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 22,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary[500],
    borderRadius: 12,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  buttonText: {
    ...typography.body,
    color: colors.surface,
    fontWeight: '600',
  },
});
