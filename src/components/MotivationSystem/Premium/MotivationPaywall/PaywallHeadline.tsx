/**
 * PaywallHeadline - Value proposition (H1 + subtitle)
 */

import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { useHeadlineAnimation } from './usePaywallEntryAnimations';
import {
  PAYWALL_COLORS,
  PAYWALL_TYPOGRAPHY,
  SPACING,
} from './paywall.constants';

interface PaywallHeadlineProps {
  reduceMotion: boolean;
  visible: boolean;
}

export function PaywallHeadline({
  visible,
  reduceMotion,
}: PaywallHeadlineProps) {
  const { animatedStyle } = useHeadlineAnimation(visible, reduceMotion);
  return (
    <Animated.View
      style={[styles.container, reduceMotion ? undefined : animatedStyle]}
    >
      <Text style={styles.headline}>Build Better Habits</Text>
      <Text style={styles.subtitle}>
        Unlock unlimited tracking, advanced analytics, and science-backed
        motivation tools
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  headline: {
    color: PAYWALL_COLORS.text,
    fontFamily: 'System',
    fontSize: PAYWALL_TYPOGRAPHY.h1.fontSize,
    fontWeight: PAYWALL_TYPOGRAPHY.h1.fontWeight,
    letterSpacing: PAYWALL_TYPOGRAPHY.h1.letterSpacing,
    lineHeight: PAYWALL_TYPOGRAPHY.h1.lineHeight,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    color: PAYWALL_COLORS.neutral,
    fontSize: PAYWALL_TYPOGRAPHY.body.fontSize,
    fontWeight: PAYWALL_TYPOGRAPHY.body.fontWeight,
    lineHeight: PAYWALL_TYPOGRAPHY.body.lineHeight,
    paddingHorizontal: SPACING.md,
    textAlign: 'center',
  },
});
