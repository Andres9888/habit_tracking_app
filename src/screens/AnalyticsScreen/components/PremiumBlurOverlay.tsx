/**
 * PremiumBlurOverlay - Blurred overlay with upgrade CTA
 * Shows over analytics content to tease premium features
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
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
    <View style={styles.wrapper}>
      <BlurView intensity={45} style={styles.blur} tint="light" />
      <LinearGradient
        colors={['rgba(250, 249, 247, 0.3)', 'rgba(250, 249, 247, 0.85)']}
        style={styles.gradient}
      />
      <View style={styles.ctaContainer}>
        <Text style={styles.lockEmoji}>🔒</Text>
        <Text style={styles.title}>Unlock Full Analytics</Text>
        <Text style={styles.subtitle}>
          See detailed charts, trends, and insights{'\n'}to understand your
          habits better.
        </Text>
        <TouchableOpacity
          accessibilityLabel="Upgrade to Pro"
          accessibilityRole="button"
          activeOpacity={0.8}
          style={styles.upgradeButton}
          onPress={onUpgrade}
        >
          <Text style={styles.upgradeButtonText}>Upgrade to Pro</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  blur: {
    ...StyleSheet.absoluteFillObject,
  },
  ctaContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  lockEmoji: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  title: {
    ...typography.heading2,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  upgradeButton: {
    backgroundColor: colors.primary[500],
    borderRadius: 12,
    minHeight: 48,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  upgradeButtonText: {
    ...typography.button,
    color: colors.surface,
    textAlign: 'center',
  },
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
