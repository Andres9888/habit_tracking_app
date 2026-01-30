/**
 * BreakdownSection Component
 *
 * Shows the 30/60/90 day breakdown statistics.
 */

import React from 'react';
import { View, Text } from 'react-native';

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
  return (
    <View className='flex-1 space-y-2'>
      <View className='flex-row justify-between'>
        <Text className='text-sm text-stone-500'>30-day avg</Text>
        <Text className='text-sm font-medium text-stone-700'>{day30}%</Text>
      </View>
      <View className='flex-row justify-between'>
        <Text className='text-sm text-stone-500'>60-day avg</Text>
        <Text className='text-sm font-medium text-stone-700'>{day60}%</Text>
      </View>
      <View className='flex-row justify-between'>
        <Text className='text-sm text-stone-500'>90-day avg</Text>
        <Text className='text-sm font-medium text-stone-700'>{day90}%</Text>
      </View>
    </View>
  );
}
