/**
 * PricingCard Component
 * Pricing details card for the premium paywall
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

export const PricingCard: React.FC = () => (
  <View style={styles.pricingCard}>
    <View style={styles.badge}>
      <Text style={styles.badgeText}>LIMITED TIME OFFER</Text>
    </View>
    <Text style={styles.pricingLabel}>Start Your Free Trial</Text>
    <View style={styles.pricingRow}>
      <Text style={styles.pricingAmount}>$0</Text>
      <Text style={styles.pricingPeriod}> for 7 days</Text>
    </View>
    <Text style={styles.thenPricing}>Then $9.99/month</Text>
    <Text style={styles.pricingNote}>
      Cancel anytime • No commitments • Instant access
    </Text>
    <View style={styles.divider} />
    <Text style={styles.savingsText}>
      💡 Unlock unlimited habits, analytics, and insights
    </Text>
  </View>
);

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'center',
    backgroundColor: colors.premium[600],
    borderRadius: 12,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  divider: {
    backgroundColor: colors.border,
    height: 1,
    marginVertical: spacing.md,
    width: '100%',
  },
  pricingAmount: {
    color: colors.premium[600],
    fontSize: 42,
    fontWeight: '700',
    lineHeight: 48,
  },
  pricingCard: {
    backgroundColor: colors.surface,
    borderColor: colors.premium[600],
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  pricingLabel: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  pricingNote: {
    color: colors.text.tertiary,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  pricingPeriod: {
    color: colors.text.secondary,
    fontSize: 16,
    lineHeight: 24,
  },
  pricingRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  savingsText: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    textAlign: 'center',
  },
  thenPricing: {
    color: colors.text.secondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
});
