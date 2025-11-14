/**
 * Premium Upgrade Screen
 * Comprehensive premium upgrade flow with feature comparison and pricing
 */

import { Check, Crown, Sparkles, Zap } from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { usePremium } from '../hooks/usePremium';
import { useAppTheme } from '../theme';

interface PremiumUpgradeScreenProps {
  onClose?: () => void;
  onUpgrade?: () => void;
}

const PREMIUM_FEATURES = [
  {
    description: 'Track unlimited habits without restrictions',
    icon: '♾️',
    title: 'Unlimited Habits',
  },
  {
    description: 'Advanced analytics with 30-day trends and insights',
    icon: '📊',
    title: 'Premium Analytics',
  },
  {
    description: 'Access exclusive science-backed habit templates',
    icon: '✨',
    title: 'Premium Templates',
  },
  {
    description: 'Never lose a streak with unlimited streak saves',
    icon: '🛡️',
    title: 'Unlimited Streak Saves',
  },
  {
    description: 'Export your data in CSV or JSON format',
    icon: '📥',
    title: 'Data Export',
  },
  {
    description: 'Get priority support and early access to features',
    icon: '⭐',
    title: 'Priority Support',
  },
];

const PRICING_PLANS = [
  {
    badge: 'Best Value',
    discount: 'Save 17%',
    id: 'annual',
    period: 'year',
    price: '$99.99',
    pricePerMonth: '$8.33',
  },
  {
    id: 'monthly',
    period: 'month',
    price: '$9.99',
    pricePerMonth: '$9.99',
  },
];

export default function PremiumUpgradeScreen({
  onClose,
  onUpgrade,
}: PremiumUpgradeScreenProps) {
  const theme = useAppTheme();
  const { isPremium } = usePremium();
  const updateSettings = useMutation(api.settings.update);

  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');

  const selectedPricing = useMemo(
    () => PRICING_PLANS.find((p) => p.id === selectedPlan) ?? PRICING_PLANS[0],
    [selectedPlan]
  );

  const handleUpgrade = useCallback(async () => {
    try {
      // TODO: Integrate with actual payment processing (StoreKit/RevenueCat)
      // For now, simulate premium activation
      await updateSettings({ hasPremium: true });
      onUpgrade?.();
    } catch (error) {
      console.error('Failed to upgrade:', error);
    }
  }, [onUpgrade, updateSettings]);

  const colors = useMemo(
    () => ({
      accent: '#FFD700',
      background: theme.custom.colors.light.background,
      card: theme.custom.colors.light.card,
      gradientEnd: '#FFA500',
      gradientStart: '#FFD700',
      primary: theme.custom.colors.primary[500],
      textPrimary: theme.custom.colors.text.primary,
      textSecondary: theme.custom.colors.text.secondary,
      textTertiary: theme.custom.colors.text.tertiary,
    }),
    [theme]
  );

  if (isPremium) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.premiumActiveContainer}>
          <Crown color={colors.accent} size={48} strokeWidth={2} />
          <Text style={[styles.premiumActiveTitle, { color: colors.textPrimary }]}>
            You're Premium! 🎉
          </Text>
          <Text
            style={[styles.premiumActiveSubtitle, { color: colors.textSecondary }]}
          >
            Thank you for supporting the app. Enjoy all premium features.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: colors.background }}
    >
      {/* Header */}
      <View style={styles.header}>
        {onClose && (
          <Pressable
            accessibilityLabel='Close'
            accessibilityRole='button'
            onPress={onClose}
            style={styles.closeButton}
          >
            <Text style={[styles.closeButtonText, { color: colors.textSecondary }]}>
              ✕
            </Text>
          </Pressable>
        )}
      </View>

      {/* Premium Badge */}
      <View style={styles.badgeContainer}>
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
          style={styles.badge}
        >
          <Crown color='#6b4500' size={20} strokeWidth={2.5} />
          <Text style={styles.badgeText}>PREMIUM</Text>
        </LinearGradient>
      </View>

      {/* Title */}
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        Unlock Premium Features
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Get the most out of your habit tracking journey
      </Text>

      {/* Pricing Plans */}
      <View style={styles.pricingContainer}>
        {PRICING_PLANS.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          return (
            <Pressable
              key={plan.id}
              accessibilityLabel={`Select ${plan.period} plan`}
              accessibilityRole='button'
              onPress={() => setSelectedPlan(plan.id as 'monthly' | 'annual')}
              style={[
                styles.pricingCard,
                {
                  backgroundColor: colors.card,
                  borderColor: isSelected ? colors.accent : colors.card,
                  borderWidth: isSelected ? 2 : 1,
                },
              ]}
            >
              {plan.badge && (
                <View style={[styles.badgeTag, { backgroundColor: colors.accent }]}>
                  <Text style={styles.badgeTagText}>{plan.badge}</Text>
                </View>
              )}
              <Text style={[styles.pricingPrice, { color: colors.textPrimary }]}>
                {plan.price}
              </Text>
              <Text style={[styles.pricingPeriod, { color: colors.textSecondary }]}>
                per {plan.period}
              </Text>
              {plan.pricePerMonth && (
                <Text style={[styles.pricingPerMonth, { color: colors.textTertiary }]}>
                  {plan.pricePerMonth}/month
                </Text>
              )}
              {plan.discount && (
                <Text style={[styles.discountText, { color: colors.accent }]}>
                  {plan.discount}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Features List */}
      <View style={styles.featuresContainer}>
        <Text style={[styles.featuresTitle, { color: colors.textPrimary }]}>
          What's Included
        </Text>
        {PREMIUM_FEATURES.map((feature, index) => (
          <View
            key={index}
            style={[
              styles.featureItem,
              {
                backgroundColor: colors.card,
              },
            ]}
          >
            <View style={styles.featureIconContainer}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
            </View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>
                {feature.title}
              </Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                {feature.description}
              </Text>
            </View>
            <Check color={colors.primary} size={20} strokeWidth={2.5} />
          </View>
        ))}
      </View>

      {/* CTA Button */}
      <Pressable
        accessibilityLabel='Start free trial'
        accessibilityRole='button'
        onPress={handleUpgrade}
        style={styles.ctaButton}
      >
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          end={{ x: 1, y: 0 }}
          start={{ x: 0, y: 0 }}
          style={styles.ctaGradient}
        >
          <Sparkles color='#6b4500' size={20} strokeWidth={2.5} />
          <Text style={styles.ctaButtonText}>Start 7-Day Free Trial</Text>
          <Zap color='#6b4500' size={20} strokeWidth={2.5} />
        </LinearGradient>
      </Pressable>

      {/* Fine Print */}
      <Text style={[styles.finePrint, { color: colors.textTertiary }]}>
        By starting your trial, you agree to our Terms of Service and Privacy Policy.
        You won't be charged until after your 7-day trial ends. Cancel anytime.
      </Text>

      {/* Restore Purchases */}
      <Pressable
        accessibilityLabel='Restore purchases'
        accessibilityRole='button'
        onPress={() => {
          // TODO: Implement restore purchases
          console.log('Restore purchases');
        }}
        style={styles.restoreButton}
      >
        <Text style={[styles.restoreButtonText, { color: colors.primary }]}>
          Already premium? Restore purchases
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    borderRadius: 20,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  badgeContainer: {
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  badgeTag: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    position: 'absolute',
    right: 8,
    top: 8,
  },
  badgeTagText: {
    color: '#6b4500',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  badgeText: {
    color: '#6b4500',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginLeft: 6,
    textTransform: 'uppercase',
  },
  closeButton: {
    alignItems: 'center',
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: '300',
  },
  container: {
    flex: 1,
  },
  ctaButton: {
    borderRadius: 16,
    marginBottom: 16,
    marginTop: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  ctaButtonText: {
    color: '#6b4500',
    fontSize: 17,
    fontWeight: '700',
    marginHorizontal: 8,
  },
  ctaGradient: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  discountText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  featureContent: {
    flex: 1,
    marginLeft: 12,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  featureIcon: {
    fontSize: 24,
  },
  featureIconContainer: {
    alignItems: 'center',
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  featureItem: {
    alignItems: 'center',
    borderRadius: 12,
    flexDirection: 'row',
    marginBottom: 12,
    padding: 16,
  },
  featuresContainer: {
    marginBottom: 24,
    marginTop: 32,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  finePrint: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  header: {
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  premiumActiveContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  premiumActiveSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 12,
    textAlign: 'center',
  },
  premiumActiveTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 16,
  },
  pricingCard: {
    borderRadius: 16,
    flex: 1,
    padding: 20,
    position: 'relative',
  },
  pricingContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  pricingPeriod: {
    fontSize: 14,
    marginTop: 4,
  },
  pricingPerMonth: {
    fontSize: 12,
    marginTop: 4,
  },
  pricingPrice: {
    fontSize: 28,
    fontWeight: '700',
  },
  restoreButton: {
    paddingVertical: 12,
  },
  restoreButtonText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
});
