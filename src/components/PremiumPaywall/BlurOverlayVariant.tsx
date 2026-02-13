/**
 * Blur overlay variant: used by motivation and analytics variants
 */

import React from 'react';
import { View, ScrollView, Modal, BlurView } from 'react-native';
import { SocialProofSection } from './SocialProofSection';
import { PricingToggle } from './PricingToggle';
import { BlurOverlayHeader } from './BlurOverlayHeader';
import { BlurOverlayHero } from './BlurOverlayHero';
import { BlurOverlayActions } from './BlurOverlayActions';
import { AnalyticsFeatureList, MotivationFeatureList } from './BlurOverlayFeatureList';
import type { VariantConfig } from './PremiumPaywall.types';

interface BlurOverlayVariantProps {
  variant: 'motivation' | 'analytics';
  config: VariantConfig;
  handlers: any;
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
  const handleStartTrialPress = () => { void handlers.handleStartTrial(); };
  const handleRestorePress = () => { void handlers.handleRestorePurchases(); };

  return (
    <Modal
      transparent
      animationType={reduceMotion ? 'fade' : 'slide'}
      testID={testID}
      visible={visible}
      onRequestClose={handlers.handleClose}
    >
      <View className='flex-1'>
        <BlurView className='absolute inset-0' intensity={80} tint='dark' />
        <View className='flex-1 bg-black/40'>
          <BlurOverlayHeader disabled={handlers.isProcessing} onPress={handlers.handleClose} />
          <ScrollView
            className='flex-1 px-5'
            contentContainerStyle={{ paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
          >
            <BlurOverlayHero config={config} />
            {isAnalytics ? <AnalyticsFeatureList /> : <MotivationFeatureList triggeredByFeature={triggeredByFeature} />}
            {config.showSocialProof && <SocialProofSection dark />}
            {config.showPricingToggle && (
              <View className='mb-4'>
                <PricingToggle
                  annualPackage={handlers.annualPackage}
                  monthlyPackage={handlers.monthlyPackage}
                  onPackageChange={handlers.setSelectedPackage}
                />
              </View>
            )}
            <BlurOverlayActions
              config={config}
              handlers={handlers}
              onStartTrial={handleStartTrialPress}
              onRestore={handleRestorePress}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
