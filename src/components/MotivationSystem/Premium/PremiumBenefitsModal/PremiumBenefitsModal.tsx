/** PremiumBenefitsModal - Displays premium features with benefits and scientific backing. */

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
import { useRestorePurchases } from './useRestorePurchases';

export function PremiumBenefitsModal({
  visible,
  onClose,
  onStartTrial,
  triggeredByFeature,
  reduceMotion = false,
  testID,
}: PremiumBenefitsModalProps) {
  const { triggerSelection, triggerLightImpact } = useHapticFeedback({});
  const { handleRestore, isRestoring } = useRestorePurchases(onClose);
  const buttonScale = useSharedValue(1);

  const handleClose = useCallback(() => {
    triggerLightImpact();
    onClose();
  }, [onClose, triggerLightImpact]);

  const handleStartTrial = useCallback(() => {
    triggerSelection();
    onStartTrial();
  }, [onStartTrial, triggerSelection]);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handlePressIn = useCallback(() => {
    buttonScale.value = withTiming(0.97, { duration: 100 });
  }, [buttonScale]);

  const handlePressOut = useCallback(() => {
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
          isRestoring={isRestoring}
          reduceMotion={reduceMotion}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onRestorePurchases={() => void handleRestore()}
          onStartTrial={handleStartTrial}
        />
      </View>
    </Modal>
  );
}

export default PremiumBenefitsModal;
