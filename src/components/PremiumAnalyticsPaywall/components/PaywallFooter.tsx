/**
 * PaywallFooter Component
 * CTA button, fine print, and restore link for the premium paywall
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';

interface PaywallFooterProps {
  onStartTrial: () => void;
  onRestore: () => void;
  isProcessing?: boolean;
}

export const PaywallFooter: React.FC<PaywallFooterProps> = ({
  onStartTrial,
  onRestore,
  isProcessing = false,
}) => (
  <View>
    <AnimatedPressable
      accessibilityHint='Opens subscription options'
      accessibilityLabel='Start 7-day free trial'
      accessibilityRole='button'
      disabled={isProcessing}
      style={[styles.ctaButton, isProcessing && styles.ctaButtonDisabled]}
      onPress={onStartTrial}
    >
      <Text style={styles.ctaButtonText}>
        {isProcessing ? 'Processing...' : 'Start 7-Day Free Trial'}
      </Text>
      {!isProcessing && (
        <Ionicons color={colors.surface} name='arrow-forward' size={20} />
      )}
    </AnimatedPressable>

    <Text style={styles.finePrint}>
      By starting your trial, you agree to our Terms of Service and Privacy
      Policy. Subscription auto-renews at $9.99/month after your 7-day free
      trial. Cancel anytime before trial ends to avoid charges.
    </Text>

    <AnimatedPressable
      accessibilityLabel='Restore purchases'
      accessibilityRole='button'
      style={styles.restoreButton}
      onPress={onRestore}
    >
      <Text style={styles.restoreButtonText}>
        Already premium? Restore purchases
      </Text>
    </AnimatedPressable>
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
  ctaButtonDisabled: {
    backgroundColor: colors.premium[400],
    opacity: 0.6,
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
    fontSize: typography.bodySmall.fontSize,
    lineHeight: 20,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  restoreButton: {
    paddingVertical: spacing.sm,
  },
  restoreButtonText: {
    color: colors.premium[600],
    fontSize: typography.bodySmall.fontSize,
    lineHeight: 20,
    textAlign: 'center',
  },
});
