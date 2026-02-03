/**
 * TrialPromptModal Component
 * Onboarding modal to promote 7-day free trial
 * Shows after user signs up or creates their first habit
 */

/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
import React, { useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface TrialPromptModalProps {
  visible: boolean;
  onStartTrial: () => void;
  onSkip: () => void;
  /** Optional: Show specific context (e.g., "You created 1 habit!") */
  context?: 'signup' | 'first_habit' | 'generic';
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MODAL_WIDTH = Math.min(SCREEN_WIDTH - 48, 400);

export function TrialPromptModal({
  visible,
  onStartTrial,
  onSkip,
  context = 'signup',
}: TrialPromptModalProps) {
  // Animations
  const scale = useSharedValue(0.85);
  const opacity = useSharedValue(0);
  const badgeScale = useSharedValue(0.8);
  const sparkleRotate = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Modal entrance
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withSpring(1, { damping: 15, stiffness: 150 });

      // Badge pop
      badgeScale.value = withDelay(
        300,
        withSequence(
          withSpring(1.15, { damping: 10 }),
          withSpring(1, { damping: 12 })
        )
      );

      // Sparkle rotation loop
      sparkleRotate.value = withDelay(
        400,
        withSequence(
          withTiming(15, { duration: 800 }),
          withTiming(-15, { duration: 800 }),
          withTiming(0, { duration: 800 })
        )
      );
    } else {
      // Reset
      opacity.value = 0;
      scale.value = 0.85;
      badgeScale.value = 0.8;
      sparkleRotate.value = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const modalStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  const sparkleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sparkleRotate.value}deg` }],
  }));

  const getContextMessage = () => {
    switch (context) {
      case 'first_habit': {
        return {
          subtitle: 'You created your first habit. Ready to unlock more?',
          title: '🎉 Great start!',
        };
      }
      case 'signup': {
        return {
          subtitle: 'Start your journey with a 7-day premium trial',
          title: '✨ Welcome to ChainDay!',
        };
      }
      default: {
        return {
          subtitle: 'Unlock all features for 7 days, no credit card needed',
          title: '✨ Try Premium Free',
        };
      }
    }
  };

  const { title, subtitle } = getContextMessage();

  if (!visible) return null;

  return (
    <Modal
      transparent
      animationType='fade'
      visible={visible}
      onRequestClose={onSkip}
    >
      <BlurView intensity={80} style={styles.backdrop} tint='dark'>
        <Animated.View style={[styles.modal, modalStyle]}>
          {/* Close button */}
          <TouchableOpacity
            accessibilityLabel='Skip trial offer'
            accessibilityRole='button'
            style={styles.closeButton}
            onPress={onSkip}
          >
            <Ionicons color={colors.text.secondary} name='close' size={24} />
          </TouchableOpacity>

          {/* Badge */}
          <Animated.View style={[styles.badge, badgeStyle]}>
            <Animated.Text style={[styles.badgeIcon, sparkleStyle]}>
              ✨
            </Animated.Text>
            <Text style={styles.badgeText}>7-DAY FREE TRIAL</Text>
          </Animated.View>

          {/* Content */}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          {/* Benefits */}
          <View style={styles.benefits}>
            <BenefitRow icon='infinite' text='Unlimited habits' />
            <BenefitRow icon='analytics' text='Advanced analytics' />
            <BenefitRow icon='bulb' text='AI-powered insights' />
            <BenefitRow icon='notifications' text='Smart reminders' />
          </View>

          {/* CTA */}
          <TouchableOpacity
            accessibilityLabel='Start 7-day free trial'
            accessibilityRole='button'
            activeOpacity={0.85}
            style={styles.ctaButton}
            onPress={onStartTrial}
          >
            <Text style={styles.ctaText}>Start Free Trial</Text>
            <Ionicons color='#FFFFFF' name='arrow-forward' size={20} />
          </TouchableOpacity>

          {/* Fine print */}
          <Text style={styles.finePrint}>
            No credit card required • Cancel anytime
          </Text>

          {/* Skip link */}
          <TouchableOpacity
            accessibilityLabel='Maybe later'
            accessibilityRole='button'
            style={styles.skipButton}
            onPress={onSkip}
          >
            <Text style={styles.skipText}>Maybe later</Text>
          </TouchableOpacity>
        </Animated.View>
      </BlurView>
    </Modal>
  );
}

interface BenefitRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}

function BenefitRow({ icon, text }: BenefitRowProps) {
  return (
    <View style={styles.benefitRow}>
      <View style={styles.benefitIcon}>
        <Ionicons color={colors.premium[600]} name={icon} size={18} />
      </View>
      <Text style={styles.benefitText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  badge: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.premium[600],
    borderRadius: 20,
    flexDirection: 'row',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  badgeIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  benefitIcon: {
    alignItems: 'center',
    backgroundColor: colors.premium[50],
    borderRadius: 8,
    height: 32,
    justifyContent: 'center',
    marginRight: spacing.sm,
    width: 32,
  },
  benefitRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  benefits: {
    marginBottom: spacing.xl,
    marginTop: spacing.lg,
  },
  benefitText: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: '500',
  },
  closeButton: {
    padding: spacing.sm,
    position: 'absolute',
    right: spacing.sm,
    top: spacing.sm,
    zIndex: 10,
  },
  ctaButton: {
    alignItems: 'center',
    backgroundColor: colors.premium[600],
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    paddingVertical: spacing.lg,
    shadowColor: colors.premium[600],
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    marginRight: spacing.sm,
  },
  finePrint: {
    color: colors.text.tertiary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  modal: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    elevation: 24,
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { height: 12, width: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    width: MODAL_WIDTH,
  },
  skipButton: {
    paddingVertical: spacing.sm,
  },
  skipText: {
    color: colors.text.secondary,
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  subtitle: {
    color: colors.text.secondary,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  title: {
    color: colors.text.primary,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
});
