/**
 * PaywallHeader Component
 * Badge and title section for the premium paywall
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { typography } from '@/theme/typography';

export const PaywallHeader: React.FC = () => (
  <>
    <View style={styles.badgeContainer}>
      <View style={styles.badge}>
        <Ionicons color={colors.surface} name='star' size={20} />
        <Text style={styles.badgeText}>PREMIUM</Text>
      </View>
    </View>

    <Text style={styles.title}>Unlock Premium Analytics</Text>
    <Text style={styles.subtitle}>
      Get scientific insights into your habit patterns and progress
    </Text>
  </>
);

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    backgroundColor: colors.premium[600],
    borderRadius: 9999,
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  badgeContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  badgeText: {
    color: colors.surface,
    fontSize: typography.caption.fontSize,
    fontWeight: '700',
    letterSpacing: 0.5,
    lineHeight: 16,
    marginLeft: spacing.xs,
    textTransform: 'uppercase',
  },
  subtitle: {
    color: colors.text.secondary,
    fontSize: 17,
    lineHeight: 22,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  title: {
    color: colors.text.primary,
    fontSize: typography.heading2.fontSize,
    fontWeight: '600',
    lineHeight: 28,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
});
