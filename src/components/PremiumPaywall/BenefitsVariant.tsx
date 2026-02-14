/**
 * Benefits variant: page-sheet modal with rich feature cards
 * Dark-mode aware via useThemeColors
 */

import React from 'react';
import { View, ScrollView, Modal } from 'react-native';
import { useThemeColors } from '../../theme/ThemeContext';
import { SocialProofSection } from './SocialProofSection';
import { BenefitsHeader } from './BenefitsHeader';
import { BenefitsHero } from './BenefitsHero';
import { BenefitsFeatureCard } from './BenefitsFeatureCard';
import { BenefitsCTAFooter } from './BenefitsCTAFooter';
import { MOTIVATION_FEATURES } from './motivationFeatures';
import type { VariantConfig } from './PremiumPaywall.types';
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
          contentContainerStyle={{ paddingBottom: 140 }}
          showsVerticalScrollIndicator={false}
        >
          {sortedFeatures.map((feature, index) => (
            <BenefitsFeatureCard
              key={feature.id}
              feature={feature}
              index={index}
              isHighlighted={feature.id === triggeredByFeature}
              reduceMotion={reduceMotion}
            />
          ))}
          {config.showSocialProof && <SocialProofSection />}
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
