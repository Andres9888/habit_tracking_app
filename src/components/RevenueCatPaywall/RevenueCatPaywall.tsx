import React from 'react';
import { View, ScrollView, Modal, Platform } from 'react-native';
import { colors } from '../../theme/colors/core';
import { spacing } from '../../theme/spacing';
import { PaywallHeader } from './PaywallHeader.tsx';
import { PaywallHero } from './PaywallHero.tsx';
import { PaywallFeatureList } from './PaywallFeatureList.tsx';
import { PaywallPlanSelector } from './PaywallPlanSelector.tsx';
import { PaywallCTA } from './PaywallCTA.tsx';
import { PaywallRestoreLink } from './PaywallRestoreLink.tsx';
import { useRevenueCatPaywall } from './useRevenueCatPaywall';
import type { RevenueCatPaywallProps } from './types';
import { WebFallback } from './WebFallback';

function noop() {}

function getPlatformOS(): string | undefined {
  const fallbackPlatform = (globalThis as { __reactNativePlatformOS?: string }).__reactNativePlatformOS;
  return (Platform as { OS?: string } | undefined)?.OS ?? fallbackPlatform;
}

export function RevenueCatPaywall(
  props: RevenueCatPaywallProps | undefined,
) {
  const { visible = false, onClose = noop, dismissible = true } = props ?? {};
  const platformOS = getPlatformOS();
  const isWebPlatform =
    platformOS
      ? platformOS === 'web'
      : 'window' in globalThis && 'document' in globalThis;
  const isPlatformLoaded = !!platformOS;

  if (__DEV__ && !isPlatformLoaded) {
    console.warn('[RevenueCatPaywall] Platform.OS is undefined; using environment fallback.');
  }

  if (isWebPlatform) {
    return <WebFallback visible={visible} onClose={onClose} />;
  }

  if (!visible) return null;

  return (
    <PaywallContent
      visible={visible}
      onClose={onClose}
      onPurchaseSuccess={props?.onPurchaseSuccess}
      onRestoreSuccess={props?.onRestoreSuccess}
      dismissible={dismissible}
    />
  );
}

function PaywallContent({
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
      animationType="slide"
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
            onPress={() => { void paywall.handlePurchase(); }}
            onPressIn={paywall.handlePressIn}
            onPressOut={paywall.handlePressOut}
          />
          <PaywallRestoreLink
            disabled={paywall.isProcessing}
            onRestore={() => { void paywall.handleRestore(); }}
          />
        </ScrollView>
      </View>
    </Modal>
  );
}
