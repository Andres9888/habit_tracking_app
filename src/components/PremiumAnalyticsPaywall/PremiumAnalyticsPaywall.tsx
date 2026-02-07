/**
 * PremiumAnalyticsPaywall Component
 * Premium subscription paywall with feature list and pricing
 */

import React from 'react';
import { View, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { colors } from '../../theme/colors';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import type { PremiumAnalyticsPaywallProps } from './PremiumAnalyticsPaywall.types';
import { PREMIUM_FEATURES } from './PremiumAnalyticsPaywall.constants';
import {
  FeatureListItem,
  PricingCard,
  PaywallFooter,
  PaywallHeader,
} from './components';
import { styles } from './PremiumAnalyticsPaywall.styles';

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
            <AnimatedPressable
              accessibilityLabel='Close paywall'
              accessibilityRole='button'
              style={styles.closeButton}
              onPress={handleClose}
            >
              <Ionicons color={colors.text.primary} name='close' size={24} />
            </AnimatedPressable>
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
