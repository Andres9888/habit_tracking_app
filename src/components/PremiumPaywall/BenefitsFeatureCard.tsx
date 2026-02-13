/**
 * Single feature card for benefits variant
 */

import React from 'react';
import { View, Text } from 'react-native';
import type { MotivationFeatureItem } from './PremiumPaywall.types';

interface BenefitsFeatureCardProps {
  feature: MotivationFeatureItem;
  isHighlighted: boolean;
}

export function BenefitsFeatureCard({ feature, isHighlighted }: BenefitsFeatureCardProps) {
  return (
    <View
      className='mb-3 rounded-xl border border-stone-200 bg-white p-4'
      style={isHighlighted ? { borderColor: feature.accentColor, borderWidth: 2 } : undefined}
    >
      <View className='mb-2 flex-row items-center gap-3'>
        <View
          className='h-10 w-10 items-center justify-center rounded-full'
          style={{ backgroundColor: `${feature.accentColor}20` }}
        >
          <feature.icon color={feature.accentColor ?? '#8b5cf6'} size={20} />
        </View>
        <View className='flex-1'>
          <Text className='text-base font-semibold text-stone-800'>{feature.title}</Text>
          <Text className='text-xs text-stone-500'>{feature.description}</Text>
        </View>
      </View>
      {feature.scienceFact && (
        <Text className='text-xs italic text-stone-400'>📊 {feature.scienceFact}</Text>
      )}
    </View>
  );
}
