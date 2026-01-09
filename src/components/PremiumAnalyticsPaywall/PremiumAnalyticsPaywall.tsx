/**
 * PremiumAnalyticsPaywall Component
 * Premium subscription paywall with feature list and pricing
 */

import React from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import type { PremiumAnalyticsPaywallProps } from './PremiumAnalyticsPaywall.types';
import {
  PREMIUM_FEATURES,
  screenWidth,
  screenHeight,
} from './PremiumAnalyticsPaywall.constants';
import {
  FeatureListItem,
  PricingCard,
  PaywallFooter,
  PaywallHeader,
} from './components';

export default function PremiumAnalyticsPaywall({
  onStartTrial,
  onClose,
}: PremiumAnalyticsPaywallProps) {
  const { triggerSelection, triggerLightImpact } = useHapticFeedback({});

  const handleStartTrial = () => {
    triggerSelection();
    onStartTrial?.();
  };

  const handleRestore = () => {
    triggerLightImpact();
  };

  const handleClose = () => {
    triggerLightImpact();
    onClose?.();
  };

  return (
    <View style={styles.container}>
      <BlurView intensity={80} style={styles.blurView} tint='dark'>
        <View style={styles.header}>
          {onClose && (
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.closeButton}
              onPress={handleClose}
            >
              <Ionicons color={colors.text.primary} name='close' size={24} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <PaywallHeader />

          <View style={styles.featuresList}>
            {PREMIUM_FEATURES.map((feature, index) => (
              <FeatureListItem key={index} feature={feature} />
            ))}
          </View>

          <PricingCard />
          <PaywallFooter
            onRestore={handleRestore}
            onStartTrial={handleStartTrial}
          />
        </ScrollView>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
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
  featuresList: {
    marginBottom: spacing.xl,
  },
  header: {
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
});
