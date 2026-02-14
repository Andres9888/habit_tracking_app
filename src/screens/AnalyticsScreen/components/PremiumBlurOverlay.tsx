/**
 * PremiumBlurOverlay - Gradient blur overlay with "Unlock Full Analytics" CTA
 * Shown over premium-only chart sections for free users
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';

interface PremiumBlurOverlayProps {
  onUpgrade: () => void;
}

export const PremiumBlurOverlay: React.FC<PremiumBlurOverlayProps> = ({
  onUpgrade,
}) => {
  return (
    <View style={styles.overlay}>
      {/* Top fade from transparent to blur */}
      <LinearGradient
        colors={['rgba(250, 248, 245, 0)', 'rgba(250, 248, 245, 0.85)', 'rgba(250, 248, 245, 0.97)']}
        locations={[0, 0.3, 1]}
        style={styles.gradient}
      />

      {/* CTA content */}
      <View style={styles.ctaContainer}>
        <Text style={styles.lockIcon}>🔒</Text>
        <Text style={styles.title}>Unlock Full Analytics</Text>
        <Text style={styles.subtitle}>
          Get strength distribution, compliance heatmaps, weekly insights, habit
          rankings, and data export with Chain Day Pro.
        </Text>
        <TouchableOpacity
          accessibilityLabel="Upgrade to Pro"
          accessibilityRole="button"
          activeOpacity={0.8}
          style={styles.upgradeButton}
          onPress={onUpgrade}
        >
          <Text style={styles.upgradeButtonText}>Start Free Trial</Text>
        </TouchableOpacity>
        <Text style={styles.trialNote}>7-day free trial · Cancel anytime</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  ctaContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['2xl'],
  },
  lockIcon: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.heading2,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 22,
    maxWidth: 300,
  },
  upgradeButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginBottom: spacing.xs,
    ...Platform.select({
      ios: {
        shadowColor: '#059669',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  upgradeButtonText: {
    ...typography.button,
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  trialNote: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: spacing.sm,
  },
});
