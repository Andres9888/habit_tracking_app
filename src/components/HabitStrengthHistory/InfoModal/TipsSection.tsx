/**
 * TipsSection - Tips for building habit strength
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

const TIPS = [
  'Consistency beats intensity — daily small wins add up',
  "Don't break the chain — each day matters",
  'If you miss, get back immediately — decay is gradual',
  'Watch your 30-day comparison to track progress',
];

export function TipsSection() {
  const { colors: themeColors } = useThemeColors();

  return (
    <View className='rounded-2xl p-4' style={{ backgroundColor: themeColors.background }}>
      <Text className='mb-3 text-base font-semibold' style={{ color: themeColors.text.primary }}>
        💡 Tips for Building Strength
      </Text>
      <View className='gap-2'>
        {TIPS.map((tip, index) => (
          <Text key={index} className='text-sm leading-5' style={{ color: themeColors.text.primary }}>
            • {tip}
          </Text>
        ))}
      </View>
    </View>
  );
}
