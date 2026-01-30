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
    <Text style={styles.pricingLabel}>Premium Subscription</Text>
    <View style={styles.pricingRow}>
      <Text style={styles.pricingAmount}>$9.99</Text>
      <Text style={styles.pricingPeriod}>/month</Text>
    </View>
    <Text style={styles.pricingNote}>• 7-day free trial • Cancel anytime</Text>
  </View>
);

const styles = StyleSheet.create({
  pricingAmount: {
    color: colors.premium[600],
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
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
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    lineHeight: 18,
    marginBottom: spacing.xs,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  pricingNote: {
    color: colors.text.tertiary,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  pricingPeriod: {
    color: colors.text.secondary,
    fontSize: 14,
    lineHeight: 20,
    marginLeft: spacing.xs,
  },
  pricingRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
});
