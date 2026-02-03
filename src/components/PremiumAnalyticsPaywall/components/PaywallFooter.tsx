/**
 * PaywallFooter Component
 * CTA button, fine print, and restore link for the premium paywall
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

interface PaywallFooterProps {
  onStartTrial: () => void;
  onRestore: () => void;
}

export const PaywallFooter: React.FC<PaywallFooterProps> = ({
  onStartTrial,
  onRestore,
}) => (
  <View>
    <TouchableOpacity
      accessibilityHint='Opens subscription options'
      accessibilityLabel='Start 7-day free trial'
      accessibilityRole='button'
      activeOpacity={0.8}
      style={styles.ctaButton}
      onPress={onStartTrial}
    >
      <Text style={styles.ctaButtonText}>Start 7-Day Free Trial</Text>
      <Ionicons color={colors.surface} name='arrow-forward' size={20} />
    </TouchableOpacity>

    <Text style={styles.finePrint}>
      By starting your trial, you agree to our Terms of Service and Privacy
      Policy. Subscription auto-renews at $9.99/month after your 7-day free
      trial. Cancel anytime before trial ends to avoid charges.
    </Text>

    <TouchableOpacity
      accessibilityLabel='Restore purchases'
      accessibilityRole='button'
      activeOpacity={0.7}
      style={styles.restoreButton}
      onPress={onRestore}
    >
      <Text style={styles.restoreButtonText}>
        Already premium? Restore purchases
      </Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  ctaButton: {
    alignItems: 'center',
    backgroundColor: colors.premium[600],
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.md,
    paddingVertical: spacing.lg,
  },
  ctaButtonText: {
    color: colors.surface,
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 24,
    marginRight: spacing.sm,
  },
  finePrint: {
    color: colors.text.tertiary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  restoreButton: {
    paddingVertical: spacing.sm,
  },
  restoreButtonText: {
    color: colors.premium[600],
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
