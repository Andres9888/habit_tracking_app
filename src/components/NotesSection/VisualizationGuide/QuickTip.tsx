/**
 * Quick tip component for visualization practices
 */

import React from 'react';
import { View, Text } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import type { QuickTipProps } from './VisualizationGuide.types';

export function QuickTip({ title, description, icon }: QuickTipProps) {
  return (
    <View className='flex-row items-start gap-3 rounded-xl p-3'>
      <LinearGradient
        className='absolute inset-0 rounded-xl'
        colors={['#fffbeb', '#ffedd5']}
        end={{ x: 1, y: 0 }}
        start={{ x: 0, y: 0 }}
      />
      <View className='h-8 w-8 items-center justify-center rounded-lg bg-amber-100'>
        {icon}
      </View>
      <View className='flex-1'>
        <Text className='text-sm font-semibold text-stone-800'>{title}</Text>
        <Text className='mt-0.5 text-xs leading-relaxed text-stone-600'>
          {description}
        </Text>
      </View>
    </View>
  );
}
