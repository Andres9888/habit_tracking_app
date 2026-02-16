/**
 * Single feature card for benefits variant
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useThemeColors } from '../../theme/ThemeContext';
import type { MotivationFeatureItem } from './PremiumPaywall.types';

interface BenefitsFeatureCardProps {
  feature: MotivationFeatureItem;
  isHighlighted: boolean;
}

export function BenefitsFeatureCard({ feature, isHighlighted }: BenefitsFeatureCardProps) {
  const { colors, isDark } = useThemeColors();

  return (
    <View
      className='mb-3 rounded-xl border p-4'
      style={[
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
        isHighlighted ? { borderColor: feature.accentColor, borderWidth: 2 } : undefined,
      ]}
    >
      <View className='mb-2 flex-row items-center gap-3'>
        <View
          className='h-10 w-10 items-center justify-center rounded-full'
          style={{ backgroundColor: `${feature.accentColor}${isDark ? '30' : '20'}` }}
        >
          <feature.icon color={feature.accentColor ?? '#8b5cf6'} size={20} />
        </View>
        <View className='flex-1'>
          <Text
            className='text-base font-semibold'
            style={{ color: colors.text.primary }}
          >
            {feature.title}
          </Text>
          <Text
            className='text-xs'
            style={{ color: colors.text.secondary }}
          >
            {feature.description}
          </Text>
        </View>
      </View>
      {feature.scienceFact && (
        <Text
          className='text-xs italic'
          style={{ color: colors.text.tertiary ?? colors.text.secondary }}
        >
          📊 {feature.scienceFact}
        </Text>
      )}
    </View>
  );
}
