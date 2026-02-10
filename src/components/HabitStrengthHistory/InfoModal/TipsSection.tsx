/**
 * TipsSection - Tips for building habit strength
 */

import React from 'react';
import { View, Text } from 'react-native';

const TIPS = [
  'Consistency beats intensity — daily small wins add up',
  "Don't break the chain — each day matters",
  'If you miss, get back immediately — decay is gradual',
  'Watch your 30-day comparison to track progress',
];

export function TipsSection() {
  return (
    <View className='rounded-2xl bg-stone-50 p-4'>
      <Text className='mb-3 text-base font-semibold text-stone-700'>
        💡 Tips for Building Strength
      </Text>
      <View className='gap-2'>
        {TIPS.map((tip, index) => (
          <Text key={index} className='text-sm leading-5 text-stone-600'>
            • {tip}
          </Text>
        ))}
      </View>
    </View>
  );
}
