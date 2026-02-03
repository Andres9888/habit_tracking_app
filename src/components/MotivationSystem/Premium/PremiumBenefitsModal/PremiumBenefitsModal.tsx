/**
 * PremiumBenefitsModal Component
 *
 * A modal that displays all premium motivation features with their
 * benefits and scientific backing.
 */

import React, { useCallback, useState } from 'react';
import { View, ScrollView, Modal, Alert } from 'react-native';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useHapticFeedback } from '../../../../hooks/useHapticFeedback';
import { usePremium } from '../../../../hooks/usePremium';
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
  const { triggerSelection, triggerLightImpact, triggerSuccess, triggerError } = useHapticFeedback({});
  const { priceString, isLoadingOfferings, restorePurchases } = usePremium();
  const buttonScale = useSharedValue(1);
  const [isRestoring, setIsRestoring] = useState(false);

  const handleClose = useCallback(() => {
    triggerLightImpact();
    onClose();
  }, [onClose, triggerLightImpact]);

  const handleStartTrial = useCallback(() => {
    triggerSelection();
    onStartTrial();
  }, [onStartTrial, triggerSelection]);

  const handleRestorePurchases = useCallback(async () => {
    triggerLightImpact();
    setIsRestoring(true);

    try {
      const success = await restorePurchases();

      if (success) {
        // Success - found premium purchase
        triggerSuccess();
        Alert.alert(
          '✓ Purchases Restored',
          'Your premium subscription has been successfully restored!',
          [
            {
              text: 'Great!',
              onPress: () => {
                // Close modal since they now have premium
                onClose();
              },
            },
          ]
        );
      } else {
        // No purchases found
        triggerLightImpact();
        Alert.alert(
          'No Purchases Found',
          'We couldn\'t find any previous purchases for this account. If you believe this is an error, please contact support.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      // Error during restore
      triggerError();
      console.error('[PremiumBenefitsModal] Restore error:', error);
      Alert.alert(
        'Restore Failed',
        'There was a problem restoring your purchases. Please try again or contact support if the issue persists.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsRestoring(false);
    }
  }, [triggerLightImpact, triggerSuccess, triggerError, restorePurchases, onClose]);

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
          isLoadingPrice={isLoadingOfferings}
          isRestoring={isRestoring}
          priceString={priceString}
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
