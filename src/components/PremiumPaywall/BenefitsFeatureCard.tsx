/**
 * Single feature card for benefits variant
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import type { MotivationFeatureItem } from './PremiumPaywall.types';
import { iconSizes } from '@/theme/iconSizes';

interface BenefitsFeatureCardProps {
  feature: MotivationFeatureItem;
  isHighlighted: boolean;
}

export function BenefitsFeatureCard({ feature, isHighlighted }: BenefitsFeatureCardProps) {
  const { colors: themeColors } = useThemeColors();

  return (
    <View
      className='mb-3 rounded-xl border p-4'
      style={isHighlighted ? { borderColor: feature.accentColor, borderWidth: 2, backgroundColor: themeColors.card } : { borderColor: themeColors.border, backgroundColor: themeColors.card }}
    >
      <View className='mb-2 flex-row items-center gap-3'>
        <View
          className='h-10 w-10 items-center justify-center rounded-full'
          style={{ backgroundColor: `${feature.accentColor}20` }}
        >
          <feature.icon color={feature.accentColor ?? '#8b5cf6'} size={iconSizes.medium} />
        </View>
        <View className='flex-1'>
          <Text className='text-base font-semibold' style={{ color: themeColors.text.primary }}>{feature.title}</Text>
          <Text className='text-xs' style={{ color: themeColors.text.secondary }}>{feature.description}</Text>
        </View>
      </View>
      {feature.scienceFact ? <Text className='text-xs italic' style={{ color: themeColors.text.tertiary }}>📊 {feature.scienceFact}</Text> : null}
    </View>
  );
}
