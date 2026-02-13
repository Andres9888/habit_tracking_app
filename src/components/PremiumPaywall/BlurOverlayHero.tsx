/**
 * Blur overlay variant: Hero section
 */

import React from 'react';
import { View, Text } from 'react-native';
import type { VariantConfig } from './PremiumPaywall.types';

export function BlurOverlayHero({ config }: { config: VariantConfig }) {
  return (
    <View className='mb-6 mt-4 items-center'>
      <Text className='mb-2 text-center text-2xl font-bold text-white'>
        {config.heroTitle}
      </Text>
      <Text className='text-center text-base text-white/70'>{config.heroSubtitle}</Text>
    </View>
  );
}
