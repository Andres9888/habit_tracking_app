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

export default function PremiumAnalyticsPaywall({ onStartTrial, onClose }: Props) {
  const features = [
    {
      icon: 'stats-chart',
      title: 'Strength Distribution',
      description: 'Visualize your habits across 5 strength levels with interactive charts',
    },
    {
      icon: 'trending-up',
      title: '30-Day Trends',
      description: 'Track your progress over time with detailed trend analysis',
    },
    {
      icon: 'calendar',
      title: 'Compliance Heatmap',
      description: 'GitHub-style calendar showing 90 days of habit completion patterns',
    },
    {
      icon: 'bulb',
      title: 'Weekly Insights',
      description: 'AI-powered insights on habits gaining or losing strength',
    },
    {
      icon: 'trophy',
      title: 'Rankings & Streaks',
      description: 'See your habits ranked by strength with current streaks',
    },
    {
      icon: 'download',
      title: 'Data Export',
      description: 'Export your complete habit data as CSV or JSON',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Blurred background preview */}
      <BlurView intensity={80} tint="dark" style={styles.blurView}>
        {/* Header */}
        <View style={styles.header}>
          {onClose && (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={24} color={colors.text.primary} />
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
              <Ionicons name="star" size={20} color={colors.surface} />
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
                  <Ionicons name={feature.icon as any} size={24} color={colors.primary} />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
                <Ionicons name="checkmark-circle" size={20} color={colors.success} />
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
            style={styles.ctaButton}
            onPress={onStartTrial}
            activeOpacity={0.8}
          >
            <Text style={styles.ctaButtonText}>Start 7-Day Free Trial</Text>
            <Ionicons name="arrow-forward" size={20} color={colors.surface} />
          </TouchableOpacity>

          {/* Fine Print */}
          <Text style={styles.finePrint}>
            By starting your trial, you agree to our Terms of Service and Privacy Policy.
            You won't be charged until after your 7-day trial ends.
          </Text>

          {/* Already Premium Link */}
          <TouchableOpacity style={styles.restoreButton} activeOpacity={0.7}>
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
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  blurView: {
    width: screenWidth,
    height: screenHeight,
  },
  header: {
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'flex-end',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  badgeContainer: {
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
  },
  badgeText: {
    ...typography.caption,
    color: colors.surface,
    fontWeight: '700',
    marginLeft: spacing.xs,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  featuresList: {
    marginBottom: spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  featureContent: {
    flex: 1,
    marginRight: spacing.sm,
  },
  featureTitle: {
    ...typography.bodyBold,
    color: colors.text.primary,
    marginBottom: spacing.xxs,
  },
  featureDescription: {
    ...typography.caption,
    color: colors.text.secondary,
    lineHeight: 16,
  },
  pricingCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  pricingLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  pricingRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  pricingAmount: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.primary,
  },
  pricingPeriod: {
    ...typography.body,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  pricingNote: {
    ...typography.caption,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  ctaButtonText: {
    ...typography.button,
    color: colors.surface,
    marginRight: spacing.sm,
    fontSize: 18,
  },
  finePrint: {
    ...typography.caption,
    color: colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: spacing.lg,
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