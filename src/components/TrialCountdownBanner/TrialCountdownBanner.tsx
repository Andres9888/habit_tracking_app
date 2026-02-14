/**
 * TrialCountdownBanner - Premium trial countdown with urgency-based styling
 * Theme-aware, animated, with haptic feedback and dark mode support
 */

import React from 'react';
import { Text, View, Pressable, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import { useThemeColors } from '../../theme/ThemeContext';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { borderRadius, spacing } from '../../theme/spacing';
import type { TrialCountdownBannerProps } from './types';
import {
  LIGHT_URGENCY,
  DARK_URGENCY,
  getUrgencyLevel,
  getTrialMessage,
  getTrialSubtext,
} from './constants';
import { useTrialBannerAnimations } from './useTrialBannerAnimations';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function TrialCountdownBanner({
  daysRemaining,
  onUpgrade,
  onDismiss,
  dismissible = false,
}: TrialCountdownBannerProps) {
  const { isDark } = useThemeColors();
  const { triggerLightImpact } = useHapticFeedback({});
  const urgency = getUrgencyLevel(daysRemaining);
  const palette = isDark ? DARK_URGENCY[urgency] : LIGHT_URGENCY[urgency];

  const { containerStyle, iconStyle } = useTrialBannerAnimations({
    visible: true,
    urgency,
  });

  const handleUpgrade = () => {
    triggerLightImpact();
    onUpgrade();
  };

  const handleDismiss = () => {
    triggerLightImpact();
    onDismiss?.();
  };

  return (
    <Animated.View
      accessible
      accessibilityLabel={getTrialMessage(daysRemaining)}
      accessibilityRole="alert"
      style={[
        styles.container,
        {
          backgroundColor: palette.background,
          borderColor: palette.border,
        },
        containerStyle,
      ]}
    >
      <View style={styles.contentRow}>
        <Animated.View
          style={[
            styles.iconContainer,
            { backgroundColor: palette.iconBg },
            iconStyle,
          ]}
        >
          <Text style={styles.icon}>{palette.icon}</Text>
        </Animated.View>

        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: palette.text }]}>
            {getTrialMessage(daysRemaining)}
          </Text>
          <Text style={[styles.subtext, { color: palette.subtext }]}>
            {getTrialSubtext(daysRemaining)}
          </Text>
        </View>

        {dismissible && onDismiss && (
          <Pressable
            accessibilityLabel="Dismiss trial banner"
            accessibilityRole="button"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.dismissButton}
            onPress={handleDismiss}
          >
            <Text style={[styles.dismissText, { color: palette.subtext }]}>
              ✕
            </Text>
          </Pressable>
        )}
      </View>

      <AnimatedPressable
        accessibilityLabel="Upgrade to premium"
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.upgradeButton,
          { backgroundColor: palette.buttonBg },
          pressed && styles.upgradeButtonPressed,
        ]}
        onPress={handleUpgrade}
      >
        <Text style={[styles.upgradeText, { color: palette.buttonText }]}>
          {daysRemaining <= 0 ? 'Upgrade Now' : 'Start Premium'}
        </Text>
      </AnimatedPressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.large,
    borderWidth: 1,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    overflow: 'hidden',
    padding: spacing.md,
  },
  contentRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  dismissButton: {
    alignItems: 'center',
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  dismissText: {
    fontSize: 16,
    fontWeight: '600',
  },
  icon: {
    fontSize: 20,
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  subtext: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  upgradeButton: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  upgradeButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  upgradeText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
