/**
 * Styles for PricingCard component
 */

import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

export const styles = StyleSheet.create({
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
  container: {
    backgroundColor: colors.surface,
    borderColor: colors.premium[600],
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  planLabel: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  planMonthlyEquivalent: {
    color: colors.success[600],
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  planOption: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 2,
    flex: 1,
    padding: spacing.md,
    position: 'relative',
  },
  planOptionSelected: {
    backgroundColor: colors.premium[50],
    borderColor: colors.premium[600],
    borderWidth: 2,
  },
  planPeriod: {
    color: colors.text.tertiary,
    fontSize: 11,
    textAlign: 'center',
  },
  planPrice: {
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  plansContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
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
  pricingRow: {
    color: colors.premium[600],
    fontSize: 42,
    fontWeight: '700',
    lineHeight: 48,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  savingsBadge: {
    backgroundColor: colors.success[500],
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    position: 'absolute',
    right: 4,
    top: 4,
  },
  savingsBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  thenPricing: {
    color: colors.text.secondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
});
