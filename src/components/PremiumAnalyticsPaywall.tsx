import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface Props {
  onStartTrial?: () => void;
  onClose?: () => void;
}

export default function PremiumAnalyticsPaywall({
  onStartTrial,
  onClose,
}: Props) {
  const features = [
    {
      description:
        'Visualize your habits across 5 strength levels with interactive charts',
      icon: 'stats-chart',
      title: 'Strength Distribution',
    },
    {
      description: 'Track your progress over time with detailed trend analysis',
      icon: 'trending-up',
      title: '30-Day Trends',
    },
    {
      description:
        'GitHub-style calendar showing 90 days of habit completion patterns',
      icon: 'calendar',
      title: 'Compliance Heatmap',
    },
    {
      description: 'AI-powered insights on habits gaining or losing strength',
      icon: 'bulb',
      title: 'Weekly Insights',
    },
    {
      description: 'See your habits ranked by strength with current streaks',
      icon: 'trophy',
      title: 'Rankings & Streaks',
    },
    {
      description: 'Export your complete habit data as CSV or JSON',
      icon: 'download',
      title: 'Data Export',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Blurred background preview */}
      <BlurView intensity={80} style={styles.blurView} tint='dark'>
        {/* Header */}
        <View style={styles.header}>
          {onClose && (
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.closeButton}
              onPress={onClose}
            >
              <Ionicons color={colors.text.primary} name='close' size={24} />
            </TouchableOpacity>
          )}
        </View>

        {/* Content */}
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Premium Badge */}
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Ionicons color={colors.surface} name='star' size={20} />
              <Text style={styles.badgeText}>PREMIUM</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>Unlock Premium Analytics</Text>
          <Text style={styles.subtitle}>
            Get scientific insights into your habit patterns and progress
          </Text>

          {/* Features List */}
          <View style={styles.featuresList}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Ionicons
                    color={colors.primary}
                    name={feature.icon as any}
                    size={24}
                  />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>
                    {feature.description}
                  </Text>
                </View>
                <Ionicons
                  color={colors.success}
                  name='checkmark-circle'
                  size={20}
                />
              </View>
            ))}
          </View>

          {/* Pricing */}
          <View style={styles.pricingCard}>
            <Text style={styles.pricingLabel}>Premium Subscription</Text>
            <View style={styles.pricingRow}>
              <Text style={styles.pricingAmount}>$9.99</Text>
              <Text style={styles.pricingPeriod}>/month</Text>
            </View>
            <Text style={styles.pricingNote}>
              • 7-day free trial • Cancel anytime
            </Text>
          </View>

          {/* CTA Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.ctaButton}
            onPress={onStartTrial}
          >
            <Text style={styles.ctaButtonText}>Start 7-Day Free Trial</Text>
            <Ionicons color={colors.surface} name='arrow-forward' size={20} />
          </TouchableOpacity>

          {/* Fine Print */}
          <Text style={styles.finePrint}>
            By starting your trial, you agree to our Terms of Service and
            Privacy Policy. You won't be charged until after your 7-day trial
            ends.
          </Text>

          {/* Already Premium Link */}
          <TouchableOpacity activeOpacity={0.7} style={styles.restoreButton}>
            <Text style={styles.restoreButtonText}>
              Already premium? Restore purchases
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 20,
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
    ...typography.caption,
    color: colors.surface,
    fontWeight: '700',
    marginLeft: spacing.xs,
  },
  blurView: {
    height: screenHeight,
    width: screenWidth,
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  content: {
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  featureContent: {
    flex: 1,
    marginRight: spacing.sm,
  },
  featureDescription: {
    ...typography.caption,
    color: colors.text.secondary,
    lineHeight: 16,
  },
  featureIcon: {
    backgroundColor: colors.background,
    height: 40,
    alignItems: 'center',
    width: 40,
    borderRadius: 8,
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  featureItem: {
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: 12,
    flexDirection: 'row',
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  featuresList: {
    marginBottom: spacing.xl,
  },
  header: {
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'flex-end',
  },
  ctaButton: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: colors.primary,
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: spacing.lg,
    marginBottom: spacing.md,
  },
  featureTitle: {
    ...typography.bodyBold,
    color: colors.text.primary,
    marginBottom: spacing.xxs,
  },
  ctaButtonText: {
    ...typography.button,
    color: colors.surface,
    fontSize: 18,
    marginRight: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  finePrint: {
    ...typography.caption,
    color: colors.text.tertiary,
    lineHeight: 16,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  pricingAmount: {
    color: colors.primary,
    fontSize: 40,
    fontWeight: '700',
  },
  pricingCard: {
    backgroundColor: colors.surface,
    borderColor: colors.primary,
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  pricingLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  pricingNote: {
    ...typography.caption,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  pricingPeriod: {
    ...typography.body,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  pricingRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  restoreButton: {
    paddingVertical: spacing.sm,
  },
  restoreButtonText: {
    ...typography.bodySmall,
    color: colors.primary,
    textAlign: 'center',
  },
});
