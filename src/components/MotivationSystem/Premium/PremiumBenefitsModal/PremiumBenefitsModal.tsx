/**
 * PremiumBenefitsModal Component
 *
 * A modal that displays all premium motivation features with their
 * benefits and scientific backing.
 */

import React, { useCallback } from 'react';
import { View, ScrollView, Modal } from 'react-native';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useHapticFeedback } from '../../../../hooks/useHapticFeedback';
import type { PremiumBenefitsModalProps } from './PremiumBenefitsModal.types';
import { PREMIUM_FEATURES } from './premiumFeatures';
import { ModalHeader } from './ModalHeader';
import { HeroSection } from './HeroSection';
import { FeatureRow } from './FeatureRow';
import { SocialProof } from './SocialProof';
import { CTAFooter } from './CTAFooter';

export function PremiumBenefitsModal({
  visible,
  onClose,
  onStartTrial,
  triggeredByFeature,
  reduceMotion = false,
  testID,
}: PremiumBenefitsModalProps) {
  const { triggerSelection, triggerLightImpact } = useHapticFeedback({});
  const buttonScale = useSharedValue(1);

  const handleClose = useCallback(() => {
    triggerLightImpact();
    onClose();
  }, [onClose, triggerLightImpact]);

  const handleStartTrial = useCallback(() => {
    triggerSelection();
    onStartTrial();
  }, [onStartTrial, triggerSelection]);

  const handleRestorePurchases = useCallback(() => {
    triggerLightImpact();
    // TODO: Implement restore purchases
  }, [triggerLightImpact]);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleButtonPressIn = useCallback(() => {
    buttonScale.value = withTiming(0.97, { duration: 100 });
  }, [buttonScale]);

  const handleButtonPressOut = useCallback(() => {
    buttonScale.value = withTiming(1, { duration: 100 });
  }, [buttonScale]);

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
      onRequestClose={handleClose}
    >
      <View className='flex-1 bg-stone-50'>
        <ModalHeader onClose={handleClose} />
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
          buttonAnimatedStyle={buttonAnimatedStyle}
          reduceMotion={reduceMotion}
          onPressIn={handleButtonPressIn}
          onPressOut={handleButtonPressOut}
          onRestorePurchases={handleRestorePurchases}
          onStartTrial={handleStartTrial}
        />
      </View>
    </Modal>
  );
}

export default PremiumBenefitsModal;
