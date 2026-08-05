/**
 * Benefits variant hero component
 */

import React from 'react';
import { Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { VariantConfig } from './PremiumPaywall.types';

export function BenefitsHero({ config }: { config: VariantConfig }) {
  return (
    <LinearGradient
      className='px-4 py-5'
      colors={[config.gradientColors[0], config.gradientColors[1]]}
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
    >
      <Text className='mb-1 text-center text-xl font-bold text-white'>
        {config.heroTitle}
      </Text>
      <Text className='text-center text-sm' style={{ color: 'rgba(255,255,255,0.8)' }}>{config.heroSubtitle}</Text>
    </LinearGradient>
  );
}
