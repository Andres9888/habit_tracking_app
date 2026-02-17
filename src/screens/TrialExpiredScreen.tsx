/**
 * TrialExpiredScreen
 *
 * Full-screen modal shown when the 7-day free trial expires.
 * Highlights the premium features the user will lose access to,
 * creating motivation to convert to a paid subscription.
 *
 * Design system:
 *  - Typography: 34/22/17/13 (display/title/body/caption)
 *  - Font: System (SF Pro / Roboto)
 *  - Primary green: #047857 (text), #059669 (buttons)
 *  - Shadows: 4px offset, 16px blur, 0.08 opacity
 *  - Animation: springify().damping(18), 280ms, 60ms stagger
 *  - Border radius: 16px cards, 12px buttons
 */
/* eslint-disable max-lines-per-function */

import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenErrorBoundary } from '../components/ErrorBoundary';
import { useThemeColors } from '../theme/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Premium features the user stands to lose
const LOST_FEATURES: Array<{ emoji: string; title: string; description: string }> = [
  {
    emoji: '🔥',
    title: 'Unlimited Habits',
    description: 'Free tier limits you to 3 habits. Your current streaks stay, but you can\'t add more.',
  },
  {
    emoji: '📊',
    title: 'Advanced Analytics',
    description: 'Habit strength charts, weekly completion trends, and long-term progress graphs.',
  },
  {
    emoji: '🎯',
    title: 'Habit Templates',
    description: 'Expert-designed habit packs for fitness, focus, sleep, and productivity.',
  },
  {
    emoji: '⚡️',
    title: 'Streak Protection',
    description: 'Miss a day? Streak protection shields your chains on your busiest days.',
  },
  {
    emoji: '🔔',
    title: 'Smart Reminders',
    description: 'Adaptive notifications that learn your schedule and remind you at the right moment.',
  },
];

interface TrialExpiredScreenProps {
  visible: boolean;
  onUpgradePress: () => void;
  onDismiss: () => void;
}

function FeatureRow({
  emoji,
  title,
  description,
  delay,
  colors,
}: {
  emoji: string;
  title: string;
  description: string;
  delay: number;
  colors: ReturnType<typeof useThemeColors>['colors'];
}) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(280).springify().damping(18)}
      style={[styles.featureCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
    >
      <Text style={styles.featureEmoji} accessibilityElementsHidden>
        {emoji}
      </Text>
      <View style={styles.featureText}>
        <Text style={[styles.featureTitle, { color: colors.text.primary }]}>
          {title}
        </Text>
        <Text style={[styles.featureDesc, { color: colors.text.secondary }]}>
          {description}
        </Text>
      </View>
    </Animated.View>
  );
}

function TrialExpiredContent({
  onUpgradePress,
  onDismiss,
}: Omit<TrialExpiredScreenProps, 'visible'>) {
  const { colors } = useThemeColors();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <Animated.View
        entering={FadeInDown.duration(320).springify().damping(18)}
        style={[styles.header, { paddingTop: insets.top + 24 }]}
      >
        <Text style={styles.headerEmoji}>🔐</Text>
        <Text style={[styles.headline, { color: '#047857' }]}>
          Your Trial Has Ended
        </Text>
        <Text style={[styles.subheadline, { color: colors.text.secondary }]}>
          You've experienced the full power of ChainDay Premium.{'\n'}
          Here's what you'll lose without upgrading:
        </Text>
      </Animated.View>

      {/* Features you'll lose */}
      <ScrollView
        contentContainerStyle={[
          styles.featureList,
          { paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {LOST_FEATURES.map((feature, index) => (
          <FeatureRow
            key={feature.title}
            emoji={feature.emoji}
            title={feature.title}
            description={feature.description}
            delay={100 + index * 60}
            colors={colors}
          />
        ))}
      </ScrollView>

      {/* Sticky CTA */}
      <Animated.View
        entering={FadeIn.delay(500).duration(280)}
        style={[
          styles.ctaContainer,
          {
            backgroundColor: colors.background,
            paddingBottom: insets.bottom + 16,
            borderTopColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.ctaNote, { color: colors.text.tertiary }]}>
          Cancel anytime · No hidden fees
        </Text>

        <Pressable
          onPress={onUpgradePress}
          style={({ pressed }) => [
            styles.upgradeButton,
            { opacity: pressed ? 0.88 : 1 },
          ]}
          accessibilityRole='button'
          accessibilityLabel='Upgrade to Premium and keep your streaks'
        >
          <Text style={styles.upgradeButtonText}>
            🚀  Keep My Streaks — Upgrade Now
          </Text>
        </Pressable>

        <Pressable
          onPress={onDismiss}
          style={({ pressed }) => [styles.dismissButton, { opacity: pressed ? 0.6 : 1 }]}
          accessibilityRole='button'
          accessibilityLabel='Maybe later, continue with free plan'
        >
          <Text style={[styles.dismissText, { color: colors.text.tertiary }]}>
            Maybe later
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

export function TrialExpiredScreen({
  visible,
  onUpgradePress,
  onDismiss,
}: TrialExpiredScreenProps) {
  return (
    <Modal
      animationType='slide'
      presentationStyle='pageSheet'
      visible={visible}
      onRequestClose={onDismiss}
      accessible
      accessibilityViewIsModal
    >
      <ScreenErrorBoundary screenName='TrialExpired'>
        <TrialExpiredContent
          onUpgradePress={onUpgradePress}
          onDismiss={onDismiss}
        />
      </ScreenErrorBoundary>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ctaContainer: {
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    bottom: 0,
    gap: 10,
    left: 0,
    paddingHorizontal: 24,
    paddingTop: 16,
    position: 'absolute',
    right: 0,
  },
  ctaNote: {
    fontFamily: 'System',
    fontSize: 12,
    letterSpacing: 0.1,
  },
  dismissButton: {
    paddingVertical: 8,
  },
  dismissText: {
    fontFamily: 'System',
    fontSize: 15,
  },
  featureCard: {
    alignItems: 'flex-start',
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 2,
    flexDirection: 'row',
    gap: 14,
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  featureDesc: {
    fontFamily: 'System',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  featureEmoji: {
    fontSize: 26,
    lineHeight: 32,
    marginTop: 2,
  },
  featureList: {
    gap: 0,
    paddingTop: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: 'System',
    fontSize: 17,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    gap: 8,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  headerEmoji: {
    fontSize: 56,
    lineHeight: 64,
    marginBottom: 4,
  },
  headline: {
    fontFamily: 'System',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  subheadline: {
    fontFamily: 'System',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  upgradeButton: {
    alignItems: 'center',
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    width: Math.min(SCREEN_WIDTH - 48, 400),
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontFamily: 'System',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
});
