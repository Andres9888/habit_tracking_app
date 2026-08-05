/**
 * Benefits variant: page-sheet modal with rich feature cards
 */

import React from 'react';
import { View, ScrollView, Modal } from 'react-native';
import { SocialProofSection } from './SocialProofSection';
import { BenefitsHeader } from './BenefitsHeader';
import { BenefitsHero } from './BenefitsHero';
import { BenefitsFeatureCard } from './BenefitsFeatureCard';
import { BenefitsCTAFooter } from './BenefitsCTAFooter';
import { MOTIVATION_FEATURES } from './motivationFeatures';
import type { VariantConfig } from './PremiumPaywall.types';
import { useThemeColors } from '../../theme/ThemeContext';
import type { PremiumPaywallHandlers } from './usePremiumPaywall';

interface BenefitsVariantProps {
  config: VariantConfig;
  handlers: PremiumPaywallHandlers;
  triggeredByFeature?: string;
  reduceMotion: boolean;
  testID?: string;
  visible: boolean;
}

export function BenefitsVariant({
  config,
  handlers,
  triggeredByFeature,
  reduceMotion,
  testID,
  visible,
}: BenefitsVariantProps) {
  const { colors } = useThemeColors();
  const sortedFeatures = [...MOTIVATION_FEATURES].sort((a, b) => {
    if (a.id === triggeredByFeature) return -1;
    if (b.id === triggeredByFeature) return 1;
    return 0;
  });

  const handleStartTrialPress = () => { void handlers.handleStartTrial(); };
  const handleRestorePress = () => { void handlers.handleRestorePurchases(); };

  return (
    <Modal
      accessibilityViewIsModal
      animationType={reduceMotion ? 'fade' : 'slide'}
      presentationStyle='pageSheet'
      testID={testID}
      transparent={false}
      visible={visible}
      onRequestClose={handlers.handleClose}
    >
      <View className='flex-1' style={{ backgroundColor: colors.background }}>
        <BenefitsHeader config={config} onClose={handlers.handleClose} />
        <BenefitsHero config={config} />
        <ScrollView
          className='flex-1 px-4 pt-4'
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {sortedFeatures.map((feature) => (
            <BenefitsFeatureCard
              key={feature.id}
              feature={feature}
              isHighlighted={feature.id === triggeredByFeature}
            />
          ))}
          {config.showSocialProof ? <SocialProofSection /> : null}
        </ScrollView>
        <BenefitsCTAFooter
          config={config}
          handlers={handlers}
          reduceMotion={reduceMotion}
          onRestore={handleRestorePress}
          onStartTrial={handleStartTrialPress}
        />
      </View>
    </Modal>
  );
}
