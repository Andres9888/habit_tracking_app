/**
 * PremiumBenefitsModal Component
 *
 * A modal that displays all premium motivation features with their
 * benefits and scientific backing.
 */

import React from 'react';
import { View, ScrollView, Modal } from 'react-native';
import type { PremiumBenefitsModalProps } from './PremiumBenefitsModal.types';
import { PREMIUM_FEATURES } from './premiumFeatures';
import { ModalHeader } from './ModalHeader';
import { HeroSection } from './HeroSection';
import { FeatureRow } from './FeatureRow';
import { SocialProof } from './SocialProof';
import { CTAFooter } from './CTAFooter';
import { usePremiumModalHandlers } from './usePremiumModalHandlers';

export function PremiumBenefitsModal({
  visible,
  onClose,
  onStartTrial,
  triggeredByFeature,
  reduceMotion = false,
  testID,
}: PremiumBenefitsModalProps) {
  const handlers = usePremiumModalHandlers(onClose, onStartTrial);

  const sortedFeatures = [...PREMIUM_FEATURES].sort((a, b) => {
    if (a.id === triggeredByFeature) return -1;
    if (b.id === triggeredByFeature) return 1;
    return 0;
  });

  return (
    <Modal
      animationType={reduceMotion ? 'fade' : 'slide'}
      presentationStyle='pageSheet'
      testID={testID}
      transparent={false}
      visible={visible}
      onRequestClose={handlers.handleClose}
    >
      <View className='flex-1 bg-stone-50'>
        <ModalHeader onClose={handlers.handleClose} />
        <HeroSection />
        <ScrollView
          className='flex-1 px-4 pt-4'
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {sortedFeatures.map((feature, index) => (
            <FeatureRow
              key={feature.id}
              feature={feature}
              index={index}
              isHighlighted={feature.id === triggeredByFeature}
              reduceMotion={reduceMotion}
            />
          ))}
          <SocialProof />
        </ScrollView>
        <CTAFooter
          buttonAnimatedStyle={handlers.buttonAnimatedStyle}
          isLoadingPrice={handlers.isLoadingOfferings}
          isRestoring={handlers.isRestoring}
          priceString={handlers.priceString}
          reduceMotion={reduceMotion}
          onPressIn={handlers.handleButtonPressIn}
          onPressOut={handlers.handleButtonPressOut}
          onRestorePurchases={handlers.handleRestorePurchases}
          onStartTrial={handlers.handleStartTrial}
        />
      </View>
    </Modal>
  );
}

export default PremiumBenefitsModal;
