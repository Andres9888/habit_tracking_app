/* eslint-disable max-lines-per-function */
/**
 * Blur overlay variant: used by motivation and analytics variants
 */

import React from 'react';
import { View, ScrollView, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import { SocialProofSection } from './SocialProofSection';
import { PricingToggle } from './PricingToggle';
import type { PremiumPaywallHandlers } from './usePremiumPaywall';
import { BlurOverlayHeader } from './BlurOverlayHeader';
import { BlurOverlayHero } from './BlurOverlayHero';
import { BlurOverlayActions } from './BlurOverlayActions';
import {
  AnalyticsFeatureList,
  MotivationFeatureList,
} from './BlurOverlayFeatureList';
import type { VariantConfig } from './PremiumPaywall.types';

interface BlurOverlayVariantProps {
  variant: 'motivation' | 'analytics';
  config: VariantConfig;
  handlers: PremiumPaywallHandlers;
  triggeredByFeature?: string;
  reduceMotion: boolean;
  testID?: string;
  visible: boolean;
}

export function BlurOverlayVariant({
  variant,
  config,
  handlers,
  triggeredByFeature,
  reduceMotion,
  testID,
  visible,
}: BlurOverlayVariantProps) {
  const isAnalytics = variant === 'analytics';
  const handleStartTrialPress = () => {
    void handlers.handleStartTrial();
  };
  const handleRestorePress = () => {
    void handlers.handleRestorePurchases();
  };

  return (
    <Modal
      accessibilityViewIsModal
      transparent
      animationType={reduceMotion ? 'fade' : 'slide'}
      testID={testID}
      visible={visible}
      onRequestClose={handlers.handleClose}
    >
      <View className='flex-1'>
        <BlurView className='absolute inset-0' intensity={80} tint='dark' />
        <View className='flex-1 bg-black/40'>
          <BlurOverlayHeader
            disabled={handlers.isProcessing}
            onPress={handlers.handleClose}
          />
          <ScrollView
            className='flex-1 px-5'
            contentContainerStyle={{ paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
          >
            <BlurOverlayHero config={config} />
            {isAnalytics ? (
              <AnalyticsFeatureList />
            ) : (
              <MotivationFeatureList triggeredByFeature={triggeredByFeature} />
            )}
            {config.showSocialProof ? <SocialProofSection dark /> : null}
            {config.showPricingToggle ? <View className='mb-4'>
                <PricingToggle
                  annualPackage={handlers.annualPackage}
                  monthlyPackage={handlers.monthlyPackage}
                  onPackageChange={handlers.setSelectedPackage}
                />
              </View> : null}
            <BlurOverlayActions
              config={config}
              handlers={handlers}
              onRestore={handleRestorePress}
              onStartTrial={handleStartTrialPress}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
