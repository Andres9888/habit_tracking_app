/**
 * PaywallFeatures - 3 key benefits with icons
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { useFeaturesAnimation } from './usePaywallEntryAnimations';
import {
  PAYWALL_COLORS,
  PAYWALL_TYPOGRAPHY,
  SPACING,
  PAYWALL_FEATURES,
} from './paywall.constants';

interface PaywallFeaturesProps {
  reduceMotion: boolean;
  visible: boolean;
}

export function PaywallFeatures({
  visible,
  reduceMotion,
}: PaywallFeaturesProps) {
  const { animatedStyle } = useFeaturesAnimation(visible, reduceMotion);
  return (
    <Animated.View
      style={[styles.container, reduceMotion ? undefined : animatedStyle]}
    >
      {PAYWALL_FEATURES.map((feature) => {
        const Icon = feature.icon;
        return (
          <View key={feature.id} style={styles.featureItem}>
            <View style={styles.iconContainer}>
              <Icon color={PAYWALL_COLORS.accent} size={24} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{feature.title}</Text>
              <Text style={styles.description}>{feature.description}</Text>
            </View>
          </View>
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.lg, paddingHorizontal: SPACING.lg },
  description: {
    color: PAYWALL_COLORS.neutral,
    fontSize: PAYWALL_TYPOGRAPHY.caption.fontSize,
    lineHeight: PAYWALL_TYPOGRAPHY.caption.lineHeight,
  },
  featureItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: `${PAYWALL_COLORS.accent}15`,
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  textContainer: { flex: 1 },
  title: {
    color: PAYWALL_COLORS.text,
    fontSize: PAYWALL_TYPOGRAPHY.h3.fontSize,
    fontWeight: PAYWALL_TYPOGRAPHY.h3.fontWeight,
    letterSpacing: PAYWALL_TYPOGRAPHY.h3.letterSpacing,
    lineHeight: PAYWALL_TYPOGRAPHY.h3.lineHeight,
    marginBottom: 2,
  },
});
