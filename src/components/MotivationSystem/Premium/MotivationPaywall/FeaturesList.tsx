/**
 * FeaturesList - List of premium features with highlighting
 */

import React from 'react';
import { View } from 'react-native';
import { FeatureCheck } from './FeatureCheck';
import { PAYWALL_FEATURES } from './constants';
import type { MotivationPremiumFeature } from '../PremiumFeatureLock';

interface FeaturesListProps {
  triggeredByFeature?: MotivationPremiumFeature;
  reduceMotion: boolean;
}

export function FeaturesList({
  triggeredByFeature,
  reduceMotion,
}: FeaturesListProps) {
  return (
    <View className='mb-6'>
      {PAYWALL_FEATURES.map((feature, index) => (
        <FeatureCheck
          key={feature.id}
          icon={feature.icon}
          index={index}
          isHighlighted={feature.id === triggeredByFeature}
          reduceMotion={reduceMotion}
          subtitle={feature.subtitle}
          title={feature.title}
        />
      ))}
    </View>
  );
}
