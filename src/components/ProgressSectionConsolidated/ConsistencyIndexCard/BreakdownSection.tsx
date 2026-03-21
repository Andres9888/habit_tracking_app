/**
 * BreakdownSection Component
 *
 * Shows the 30/60/90 day breakdown statistics.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

interface BreakdownSectionProps {
  day30: number;
  day60: number;
  day90: number;
}

export function BreakdownSection({
  day30,
  day60,
  day90,
}: BreakdownSectionProps) {
  const { colors } = useThemeColors();

  return (
    <View className='flex-1 space-y-2'>
      <View className='flex-row justify-between'>
        <Text className='text-sm' style={{ color: colors.text.secondary }}>30-day avg</Text>
        <Text className='text-sm font-medium' style={{ color: colors.text.primary }}>{day30}%</Text>
      </View>
      <View className='flex-row justify-between'>
        <Text className='text-sm' style={{ color: colors.text.secondary }}>60-day avg</Text>
        <Text className='text-sm font-medium' style={{ color: colors.text.primary }}>{day60}%</Text>
      </View>
      <View className='flex-row justify-between'>
        <Text className='text-sm' style={{ color: colors.text.secondary }}>90-day avg</Text>
        <Text className='text-sm font-medium' style={{ color: colors.text.primary }}>{day90}%</Text>
      </View>
    </View>
  );
}
