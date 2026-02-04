/**
 * PaywallFooterRedesign - Restore purchases and fine print
 */

import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { PAYWALL_COLORS, SPACING } from './paywall.constants';

interface PaywallFooterRedesignProps {
  isProcessing: boolean;
  onRestorePurchases: () => void;
  showRestorePurchases: boolean;
}

export function PaywallFooterRedesign({
  showRestorePurchases,
  isProcessing,
  onRestorePurchases,
}: PaywallFooterRedesignProps) {
  return (
    <View style={styles.container}>
      {showRestorePurchases && (
        <Pressable
          accessibilityLabel='Restore purchases'
          accessibilityRole='button'
          disabled={isProcessing}
          style={({ pressed }) => [
            styles.restoreButton,
            pressed && styles.restoreButtonPressed,
          ]}
          onPress={onRestorePurchases}
        >
          <Text style={styles.restoreText}>
            Already premium? Restore purchases
          </Text>
        </Pressable>
      )}
      <Text style={styles.finePrint}>
        By continuing, you agree to our Terms of Service and Privacy Policy.
        {'\n'}Subscription auto-renews. Cancel anytime.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  finePrint: {
    color: PAYWALL_COLORS.neutral,
    fontSize: 12,
    lineHeight: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
  restoreButton: { marginBottom: SPACING.sm, paddingVertical: SPACING.sm },
  restoreButtonPressed: { opacity: 0.7 },
  restoreText: {
    color: PAYWALL_COLORS.accent,
    fontSize: 14,
    fontWeight: '500',
  },
});
