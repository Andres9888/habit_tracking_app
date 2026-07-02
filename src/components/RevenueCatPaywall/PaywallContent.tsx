import React from 'react';
import { View, ScrollView, Modal } from 'react-native';
import { colors } from '../../theme/colors/core';
import { spacing } from '../../theme/spacing';
import { PaywallCTA } from './PaywallCTA';
import { PaywallFeatureList } from './PaywallFeatureList';
import { PaywallHeader } from './PaywallHeader';
import { PaywallHero } from './PaywallHero';
import { PaywallPlanSelector } from './PaywallPlanSelector';
import { PaywallRestoreLink } from './PaywallRestoreLink';
import type { RevenueCatPaywallProps } from './types';
import { useRevenueCatPaywall } from './useRevenueCatPaywall';

function noop() {
  // Default no-op callback for optional props.
}

export function PaywallContent({
  visible,
  onClose,
  onPurchaseSuccess,
  onRestoreSuccess,
  dismissible = true,
}: RevenueCatPaywallProps) {
  const paywall = useRevenueCatPaywall({
    onClose,
    onPurchaseSuccess: onPurchaseSuccess ?? noop,
    onRestoreSuccess: onRestoreSuccess ?? noop,
  });

  const planLabel = paywall.selectedPlan === 'annual' ? 'Annual' : 'Monthly';
  const ctaLabel = `Start Free Trial \u2014 ${planLabel}`;

  return (
    <Modal
      accessibilityViewIsModal
      animationType='slide'
      presentationStyle={dismissible ? 'pageSheet' : 'fullScreen'}
      transparent={false}
      visible={visible}
      onRequestClose={dismissible ? paywall.handleClose : noop}
    >
      <View style={{ backgroundColor: colors.background, flex: 1 }}>
        <PaywallHeader
          disabled={paywall.isProcessing}
          hideClose={!dismissible}
          onClose={paywall.handleClose}
        />
        <ScrollView
          contentContainerStyle={{ paddingBottom: spacing['2xl'] }}
          showsVerticalScrollIndicator={false}
        >
          <PaywallHero />
          <PaywallFeatureList />
          <PaywallPlanSelector
            annualPackage={paywall.annualPackage}
            monthlyPackage={paywall.monthlyPackage}
            savingsPercent={paywall.savingsPercent}
            selectedPlan={paywall.selectedPlan}
            onSelectPlan={paywall.handleSelectPlan}
          />
          <PaywallCTA
            buttonAnimatedStyle={paywall.buttonAnimatedStyle}
            isDisabled={!paywall.selectedPackage}
            isProcessing={paywall.isProcessing}
            label={ctaLabel}
            onPress={() => {
              void paywall.handlePurchase();
            }}
            onPressIn={paywall.handlePressIn}
            onPressOut={paywall.handlePressOut}
          />
          <PaywallRestoreLink
            disabled={paywall.isProcessing}
            onRestore={() => {
              void paywall.handleRestore();
            }}
          />
        </ScrollView>
      </View>
    </Modal>
  );
}
