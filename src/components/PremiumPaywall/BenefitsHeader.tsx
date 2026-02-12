/**
 * Benefits variant header component
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Crown, X } from 'lucide-react-native';
import type { VariantConfig } from './PremiumPaywall.types';

interface BenefitsHeaderProps {
  config: VariantConfig;
  onClose: () => void;
}

export function BenefitsHeader({ config, onClose }: BenefitsHeaderProps) {
  return (
    <View className='flex-row items-center justify-between border-b border-stone-200 bg-white px-4 pb-3 pt-4'>
      <View className='flex-row items-center gap-2'>
        <LinearGradient
          className='h-8 w-8 items-center justify-center rounded-full'
          colors={[config.gradientColors[0], config.gradientColors[1]]}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
        >
          <Crown color='#ffffff' size={16} />
        </LinearGradient>
        <Text className='text-lg font-bold text-stone-800'>Premium Features</Text>
      </View>
      <Pressable
        accessibilityLabel='Close'
        accessibilityRole='button'
        className='h-8 w-8 items-center justify-center rounded-full bg-stone-100'
        hitSlop={12}
        onPress={onClose}
      >
        <X className='text-stone-500' size={24} />
      </Pressable>
    </View>
  );
}
