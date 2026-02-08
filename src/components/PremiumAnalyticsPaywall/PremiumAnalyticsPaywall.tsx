/**
 * PremiumAnalyticsPaywall Component
 * Premium subscription paywall with monthly/annual pricing
 */

import React from 'react';
import { View, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { colors } from '../../theme/colors';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { usePurchaseFlow } from './usePurchaseFlow';
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
  const { triggerLightImpact } = useHapticFeedback({});

  const {
    monthlyPackage,
    annualPackage,
    selectedPackage,
    setSelectedPackage,
    handlePurchase,
    handleRestore,
    isProcessing,
  } = usePurchaseFlow({ onClose, onSuccess: onStartTrial });

  const handleClosePress = () => {
    triggerLightImpact();
    onClose?.();
  };

  const handlePurchasePress = () => {
    void handlePurchase();
  };

  const handleRestorePress = () => {
    void handleRestore();
  };

  return (
    <View style={styles.container}>
      <BlurView intensity={80} style={styles.blurView} tint='dark'>
        <View style={styles.header}>
          {onClose && (
            <AnimatedPressable
              accessibilityLabel='Close paywall'
              accessibilityRole='button'
              activeOpacity={0.7}
              disabled={isProcessing}
              style={styles.closeButton}
              onPress={handleClosePress}
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

          <PricingCard
            annualPackage={annualPackage}
            monthlyPackage={monthlyPackage}
            onPackageChange={setSelectedPackage}
          />
          <PaywallFooter
            isProcessing={isProcessing}
            onRestore={handleRestorePress}
            onStartTrial={handlePurchasePress}
          />
        </ScrollView>
      </BlurView>
    </View>
  );
}
