import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Lock, Infinity, Sparkles, X, Check } from 'lucide-react-native';
import { useHapticFeedback } from '../hooks/useHapticFeedback';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface HabitLimitPaywallProps {
  visible: boolean;
  currentHabitCount: number;
  maxFreeHabits: number;
  onClose: () => void;
  onUpgrade: () => void;
  type?: 'soft' | 'hard'; // 'soft' = approaching limit, 'hard' = at limit
}

const PREMIUM_BENEFITS = [
  'Unlimited habits',
  'Advanced analytics',
  'Premium templates',
  'Unlimited streak saves',
  'Data export',
];

export default function HabitLimitPaywall({
  visible,
  currentHabitCount,
  maxFreeHabits,
  onClose,
  onUpgrade,
  type = 'hard',
}: HabitLimitPaywallProps) {
  const { triggerSelection, triggerLightImpact } = useHapticFeedback({});

  const isHardPaywall = type === 'hard';
  const habitsRemaining = maxFreeHabits - currentHabitCount;

  const handleUpgrade = () => {
    triggerSelection();
    onUpgrade();
  };

  const handleClose = () => {
    triggerLightImpact();
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={isHardPaywall ? undefined : handleClose}
    >
      <View style={styles.overlay}>
        <BlurView intensity={80} style={styles.blurView} tint="dark">
          <View style={styles.container}>
            {/* Close Button (only for soft paywall) */}
            {!isHardPaywall && (
              <TouchableOpacity
                accessibilityLabel="Close"
                accessibilityRole="button"
                style={styles.closeButton}
                onPress={handleClose}
              >
                <X color={colors.text.primary} size={20} />
              </TouchableOpacity>
            )}

            {/* Icon */}
            <View style={styles.iconContainer}>
              <View style={styles.iconBackground}>
                <Lock size={32} color={colors.primary[500]} strokeWidth={2} />
              </View>
            </View>

            {/* Title */}
            <Text style={styles.title}>
              {isHardPaywall
                ? 'Habit Limit Reached'
                : `Only ${habitsRemaining} Habit${habitsRemaining !== 1 ? 's' : ''} Left`}
            </Text>

            {/* Message */}
            <Text style={styles.message}>
              {isHardPaywall
                ? `You've reached the free limit of ${maxFreeHabits} habits. Upgrade to Premium to track unlimited habits and unlock advanced features.`
                : `You're using ${currentHabitCount} of ${maxFreeHabits} free habits. Upgrade to Premium for unlimited habits and more!`}
            </Text>

            {/* Habit Counter */}
            <View style={styles.counterContainer}>
              <View style={styles.counterBar}>
                <View
                  style={[
                    styles.counterFill,
                    { width: `${(currentHabitCount / maxFreeHabits) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.counterText}>
                {currentHabitCount} / {maxFreeHabits}
              </Text>
            </View>

            {/* Premium Benefits */}
            <View style={styles.benefitsContainer}>
              <Text style={styles.benefitsTitle}>Premium Benefits:</Text>
              {PREMIUM_BENEFITS.map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <Check size={18} color={colors.success[500]} />
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>

            {/* Comparison */}
            <View style={styles.comparisonContainer}>
              <View style={styles.comparisonRow}>
                <Text style={styles.comparisonLabel}>Free</Text>
                <Text style={styles.comparisonValue}>{maxFreeHabits} habits</Text>
              </View>
              <View style={styles.comparisonDivider} />
              <View style={styles.comparisonRow}>
                <View style={styles.premiumLabelContainer}>
                  <Sparkles size={14} color="#FFD700" strokeWidth={2} />
                  <Text style={styles.comparisonLabel}>Premium</Text>
                </View>
                <View style={styles.premiumValueContainer}>
                  <Infinity size={18} color={colors.primary[500]} />
                  <Text style={[styles.comparisonValue, styles.premiumValue]}>
                    Unlimited
                  </Text>
                </View>
              </View>
            </View>

            {/* CTA Button */}
            <TouchableOpacity
              accessibilityLabel="Upgrade to Premium"
              accessibilityRole="button"
              activeOpacity={0.8}
              style={styles.upgradeButton}
              onPress={handleUpgrade}
            >
              <LinearGradient
                colors={['#FFD700', '#FFA500']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.upgradeButtonGradient}
              >
                <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
                <Sparkles size={18} color="#6b4500" strokeWidth={2} />
              </LinearGradient>
            </TouchableOpacity>

            {/* Fine Print */}
            <Text style={styles.finePrint}>
              Start with a 7-day free trial. Cancel anytime.
            </Text>

            {/* Dismiss (only for soft paywall) */}
            {!isHardPaywall && (
              <TouchableOpacity
                accessibilityLabel="Maybe later"
                accessibilityRole="button"
                style={styles.dismissButton}
                onPress={handleClose}
              >
                <Text style={styles.dismissButtonText}>Maybe Later</Text>
              </TouchableOpacity>
            )}
          </View>
        </BlurView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  benefitItem: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  benefitText: {
    color: colors.text.secondary,
    fontSize: 14,
    marginLeft: spacing.sm,
  },
  benefitsContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: spacing.lg,
    padding: spacing.md,
    width: '100%',
  },
  benefitsTitle: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    position: 'absolute',
    right: spacing.md,
    top: spacing.md,
    width: 40,
    zIndex: 10,
  },
  comparisonContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: spacing.lg,
    padding: spacing.md,
    width: '100%',
  },
  comparisonDivider: {
    backgroundColor: colors.border,
    height: 1,
    marginVertical: spacing.sm,
    width: '100%',
  },
  comparisonLabel: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: '500',
  },
  comparisonRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  comparisonValue: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  container: {
    backgroundColor: colors.background,
    borderRadius: 24,
    marginHorizontal: spacing.lg,
    maxWidth: 400,
    padding: spacing.xl,
    width: '100%',
  },
  counterBar: {
    backgroundColor: colors.border,
    borderRadius: 8,
    height: 8,
    marginBottom: spacing.xs,
    overflow: 'hidden',
    width: '100%',
  },
  counterContainer: {
    marginBottom: spacing.lg,
    width: '100%',
  },
  counterFill: {
    backgroundColor: colors.primary[500],
    borderRadius: 8,
    height: '100%',
  },
  counterText: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  dismissButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
  },
  dismissButtonText: {
    color: colors.text.tertiary,
    fontSize: 14,
    textAlign: 'center',
  },
  finePrint: {
    color: colors.text.tertiary,
    fontSize: 11,
    lineHeight: 16,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  iconBackground: {
    alignItems: 'center',
    backgroundColor: colors.primary[50],
    borderRadius: 40,
    height: 80,
    justifyContent: 'center',
    width: 80,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  message: {
    color: colors.text.secondary,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  premiumLabelContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  premiumValue: {
    color: colors.primary[500],
  },
  premiumValueContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  title: {
    color: colors.text.primary,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  upgradeButton: {
    borderRadius: 16,
    marginTop: spacing.md,
    overflow: 'hidden',
    width: '100%',
  },
  upgradeButtonGradient: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
  },
  upgradeButtonText: {
    color: '#6b4500',
    fontSize: 17,
    fontWeight: '700',
    marginRight: spacing.sm,
  },
});
