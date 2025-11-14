import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Check, Lock, Sparkles, X, Zap, BarChart3, Calendar, Download, Brain, Infinity } from 'lucide-react-native';
import { useHapticFeedback } from '../hooks/useHapticFeedback';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface PremiumUpgradeScreenProps {
  visible: boolean;
  onClose: () => void;
  onStartTrial?: () => void;
  onRestorePurchases?: () => void;
}

type PricingTier = 'monthly' | 'annual';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const PREMIUM_FEATURES: Feature[] = [
  {
    icon: <Infinity size={24} color={colors.primary[500]} />,
    title: 'Unlimited Habits',
    description: 'Track as many habits as you want',
  },
  {
    icon: <BarChart3 size={24} color={colors.primary[500]} />,
    title: 'Advanced Analytics',
    description: '90-day heatmaps, trends, and insights',
  },
  {
    icon: <Calendar size={24} color={colors.primary[500]} />,
    title: 'Premium Templates',
    description: 'Access science-backed habit templates',
  },
  {
    icon: <Zap size={24} color={colors.primary[500]} />,
    title: 'Unlimited Streak Saves',
    description: 'Never lose your progress',
  },
  {
    icon: <Brain size={24} color={colors.primary[500]} />,
    title: 'AI Insights',
    description: 'Personalized habit recommendations',
  },
  {
    icon: <Download size={24} color={colors.primary[500]} />,
    title: 'Data Export',
    description: 'Export your data anytime',
  },
];

export default function PremiumUpgradeScreen({
  visible,
  onClose,
  onStartTrial,
  onRestorePurchases,
}: PremiumUpgradeScreenProps) {
  const { triggerSelection, triggerLightImpact } = useHapticFeedback({});
  const [selectedTier, setSelectedTier] = useState<PricingTier>('annual');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStartTrial = async () => {
    triggerSelection();
    setIsProcessing(true);
    try {
      await onStartTrial?.();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestorePurchases = async () => {
    triggerLightImpact();
    setIsProcessing(true);
    try {
      await onRestorePurchases?.();
    } finally {
      setIsProcessing(false);
    }
  };

  const monthlyPrice = 9.99;
  const annualPrice = 79.99;
  const annualSavings = Math.round(((monthlyPrice * 12 - annualPrice) / (monthlyPrice * 12)) * 100);

  if (!visible) return null;

  return (
    <Modal
      animationType="slide"
      presentationStyle="fullScreen"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <BlurView intensity={80} style={styles.blurView} tint="dark">
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                accessibilityLabel="Close"
                accessibilityRole="button"
                style={styles.closeButton}
                onPress={() => {
                  triggerLightImpact();
                  onClose();
                }}
              >
                <X color={colors.text.primary} size={24} />
              </TouchableOpacity>
            </View>

            {/* Premium Badge */}
            <View style={styles.badgeContainer}>
              <LinearGradient
                colors={['#FFD700', '#FFA500']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.premiumBadge}
              >
                <Sparkles size={20} color="#6b4500" strokeWidth={2.5} />
                <Text style={styles.premiumBadgeText}>PREMIUM</Text>
              </LinearGradient>
            </View>

            {/* Title */}
            <Text style={styles.title}>Unlock Premium</Text>
            <Text style={styles.subtitle}>
              Get the most out of your habit journey with advanced features and unlimited access
            </Text>

            {/* Pricing Tiers */}
            <View style={styles.pricingContainer}>
              <TouchableOpacity
                accessibilityLabel={`Monthly plan, $${monthlyPrice} per month`}
                accessibilityRole="button"
                style={[
                  styles.pricingCard,
                  selectedTier === 'monthly' && styles.pricingCardSelected,
                ]}
                onPress={() => {
                  triggerLightImpact();
                  setSelectedTier('monthly');
                }}
              >
                <View style={styles.pricingCardHeader}>
                  <Text style={styles.pricingCardTitle}>Monthly</Text>
                  {selectedTier === 'monthly' && (
                    <View style={styles.selectedIndicator}>
                      <Check size={16} color={colors.primary[500]} />
                    </View>
                  )}
                </View>
                <View style={styles.pricingRow}>
                  <Text style={styles.pricingAmount}>${monthlyPrice}</Text>
                  <Text style={styles.pricingPeriod}>/month</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                accessibilityLabel={`Annual plan, $${annualPrice} per year, save ${annualSavings}%`}
                accessibilityRole="button"
                style={[
                  styles.pricingCard,
                  selectedTier === 'annual' && styles.pricingCardSelected,
                  styles.annualCard,
                ]}
                onPress={() => {
                  triggerLightImpact();
                  setSelectedTier('annual');
                }}
              >
                <View style={styles.pricingCardHeader}>
                  <View style={styles.annualBadge}>
                    <Text style={styles.annualBadgeText}>BEST VALUE</Text>
                  </View>
                  <Text style={styles.pricingCardTitle}>Annual</Text>
                  {selectedTier === 'annual' && (
                    <View style={styles.selectedIndicator}>
                      <Check size={16} color={colors.primary[500]} />
                    </View>
                  )}
                </View>
                <View style={styles.pricingRow}>
                  <Text style={styles.pricingAmount}>${annualPrice}</Text>
                  <Text style={styles.pricingPeriod}>/year</Text>
                </View>
                <Text style={styles.savingsText}>Save {annualSavings}%</Text>
              </TouchableOpacity>
            </View>

            {/* Features List */}
            <View style={styles.featuresContainer}>
              <Text style={styles.featuresTitle}>Premium Features</Text>
              {PREMIUM_FEATURES.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <View style={styles.featureIcon}>{feature.icon}</View>
                  <View style={styles.featureContent}>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDescription}>{feature.description}</Text>
                  </View>
                  <Check size={20} color={colors.success[500]} />
                </View>
              ))}
            </View>

            {/* Comparison Table */}
            <View style={styles.comparisonContainer}>
              <Text style={styles.comparisonTitle}>Free vs Premium</Text>
              <View style={styles.comparisonTable}>
                <View style={styles.comparisonRow}>
                  <Text style={styles.comparisonLabel}>Habits</Text>
                  <Text style={styles.comparisonValue}>3</Text>
                  <Text style={[styles.comparisonValue, styles.premiumValue]}>∞</Text>
                </View>
                <View style={styles.comparisonRow}>
                  <Text style={styles.comparisonLabel}>Analytics</Text>
                  <Text style={styles.comparisonValue}>Basic</Text>
                  <Text style={[styles.comparisonValue, styles.premiumValue]}>Advanced</Text>
                </View>
                <View style={styles.comparisonRow}>
                  <Text style={styles.comparisonLabel}>Templates</Text>
                  <Text style={styles.comparisonValue}>Limited</Text>
                  <Text style={[styles.comparisonValue, styles.premiumValue]}>All</Text>
                </View>
                <View style={styles.comparisonRow}>
                  <Text style={styles.comparisonLabel}>Streak Saves</Text>
                  <Text style={styles.comparisonValue}>3/day</Text>
                  <Text style={[styles.comparisonValue, styles.premiumValue]}>∞</Text>
                </View>
                <View style={styles.comparisonRow}>
                  <Text style={styles.comparisonLabel}>Data Export</Text>
                  <Lock size={16} color={colors.text.tertiary} />
                  <Check size={16} color={colors.success[500]} />
                </View>
              </View>
            </View>

            {/* CTA Button */}
            <TouchableOpacity
              accessibilityLabel={`Start 7-day free trial, ${selectedTier === 'annual' ? 'annual plan' : 'monthly plan'}`}
              accessibilityRole="button"
              activeOpacity={0.8}
              disabled={isProcessing}
              style={[styles.ctaButton, isProcessing && styles.ctaButtonDisabled]}
              onPress={handleStartTrial}
            >
              {isProcessing ? (
                <ActivityIndicator color={colors.surface} />
              ) : (
                <>
                  <Text style={styles.ctaButtonText}>Start 7-Day Free Trial</Text>
                  <Sparkles size={20} color={colors.surface} strokeWidth={2} />
                </>
              )}
            </TouchableOpacity>

            {/* Fine Print */}
            <Text style={styles.finePrint}>
              By starting your trial, you agree to our Terms of Service and Privacy Policy.
              You won't be charged until after your 7-day trial ends.
            </Text>

            {/* Restore Purchases */}
            <TouchableOpacity
              accessibilityLabel="Restore purchases"
              accessibilityRole="button"
              style={styles.restoreButton}
              onPress={handleRestorePurchases}
            >
              <Text style={styles.restoreButtonText}>Already premium? Restore purchases</Text>
            </TouchableOpacity>
          </ScrollView>
        </BlurView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  annualBadge: {
    backgroundColor: colors.success[500],
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  annualBadgeText: {
    color: colors.surface,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  annualCard: {
    borderColor: colors.primary[500],
    borderWidth: 2,
  },
  badgeContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  blurView: {
    flex: 1,
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  comparisonContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  comparisonLabel: {
    color: colors.text.secondary,
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  comparisonRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  comparisonTable: {
    marginTop: spacing.md,
  },
  comparisonTitle: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  comparisonValue: {
    color: colors.text.tertiary,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    width: 80,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  ctaButton: {
    alignItems: 'center',
    backgroundColor: colors.primary[500],
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.md,
    paddingVertical: spacing.lg,
  },
  ctaButtonDisabled: {
    opacity: 0.6,
  },
  ctaButtonText: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: '700',
    marginRight: spacing.sm,
  },
  featureContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  featureDescription: {
    color: colors.text.secondary,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  featureIcon: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  featureItem: {
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: 12,
    flexDirection: 'row',
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  featuresContainer: {
    marginBottom: spacing.lg,
  },
  featuresTitle: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  featureTitle: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  finePrint: {
    color: colors.text.tertiary,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  header: {
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  premiumBadge: {
    alignItems: 'center',
    borderRadius: 20,
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  premiumBadgeText: {
    color: '#6b4500',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginLeft: spacing.xs,
    textTransform: 'uppercase',
  },
  premiumValue: {
    color: colors.primary[500],
  },
  pricingAmount: {
    color: colors.text.primary,
    fontSize: 28,
    fontWeight: '700',
  },
  pricingCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 2,
    flex: 1,
    padding: spacing.lg,
  },
  pricingCardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  pricingCardSelected: {
    borderColor: colors.primary[500],
  },
  pricingCardTitle: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  pricingContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  pricingPeriod: {
    color: colors.text.secondary,
    fontSize: 14,
    marginLeft: spacing.xs,
  },
  pricingRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
  },
  restoreButton: {
    paddingVertical: spacing.sm,
  },
  restoreButtonText: {
    color: colors.primary[500],
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  selectedIndicator: {
    alignItems: 'center',
    backgroundColor: colors.primary[50],
    borderRadius: 12,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  savingsText: {
    color: colors.success[500],
    fontSize: 12,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
  subtitle: {
    color: colors.text.secondary,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  title: {
    color: colors.text.primary,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
});
