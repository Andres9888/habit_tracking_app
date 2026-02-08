/**
 * MotivationPaywall Component
 * Full-screen paywall with monthly/annual pricing
 */

import React from 'react';
import { View, ScrollView, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import { CloseButton } from './CloseButton';
import { PaywallHero } from './PaywallHero';
import { FeaturesList } from './FeaturesList';
import { SocialProof } from './SocialProof';
import { PricingCard } from './PricingCard';
import { CTAButton } from './CTAButton';
import { PaywallFooter } from './PaywallFooter';
import { usePaywallHandlers } from './usePaywallHandlers';
import { usePurchaseHandlers } from './usePurchaseHandlers';
import type { MotivationPaywallProps } from './types';

export function MotivationPaywall({
  visible,
  onClose,
  onStartTrial,
  onRestorePurchases,
  triggeredByFeature,
  reduceMotion = false,
  testID,
}: MotivationPaywallProps) {
  const {
    monthlyPackage,
    annualPackage,
    selectedPackage,
    setSelectedPackage,
    wrappedOnStartTrial,
    wrappedRestorePurchases,
  } = usePurchaseHandlers({ onRestorePurchases, onStartTrial });

  const {
    isProcessing,
    handleClose,
    handleStartTrial,
    handleRestorePurchases,
  } = usePaywallHandlers({
    onClose,
    onRestorePurchases: wrappedRestorePurchases,
    onStartTrial: wrappedOnStartTrial,
  });

  const handleStartTrialWrapper = () => {
    void handleStartTrial();
  };

  const handleRestoreWrapper = () => {
    if (handleRestorePurchases) {
      void handleRestorePurchases();
    }
  };

  return (
    <Modal
      transparent
      animationType={reduceMotion ? 'fade' : 'slide'}
      testID={testID}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View className='flex-1'>
        <BlurView className='absolute inset-0' intensity={80} tint='dark' />
        <View className='flex-1 bg-black/40'>
          <CloseButton onPress={handleClose} />
          <ScrollView
            className='flex-1 px-5'
            contentContainerStyle={{ paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
          >
            <PaywallHero />
            <FeaturesList
              reduceMotion={reduceMotion}
              triggeredByFeature={triggeredByFeature}
            />
            <SocialProof />
            <PricingCard
              annualPackage={annualPackage}
              monthlyPackage={monthlyPackage}
              onPackageChange={setSelectedPackage}
            />
            <View className='mb-4'>
              <CTAButton
                isProcessing={isProcessing}
                reduceMotion={reduceMotion}
                visible={visible}
                onPress={handleStartTrialWrapper}
              />
            </View>
            <PaywallFooter
              isProcessing={isProcessing}
              showRestorePurchases
              onRestorePurchases={handleRestoreWrapper}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default MotivationPaywall;
