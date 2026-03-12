import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Crown, ChevronRight } from 'lucide-react-native';
import type { FeatureMeta } from './PremiumFeatureLock.types';

interface CardLockHeaderProps {
  meta: FeatureMeta;
}

export function CardLockHeader({ meta }: CardLockHeaderProps) {
  return (
    <LinearGradient
      className='flex-row items-center gap-3 px-4 py-3'
      colors={['#8b5cf6', '#7c3aed']}
      end={{ x: 1, y: 0 }}
      start={{ x: 0, y: 0 }}
    >
      <View className='h-10 w-10 items-center justify-center rounded-full bg-white/20'>
        <Crown color='#ffffff' size={20} />
      </View>
      <View className='flex-1'>
        <Text className='text-base font-bold text-white'>{meta.title}</Text>
        {meta.freeLimit ? <Text className='text-xs text-violet-100'>
            Free: {meta.freeLimit}
          </Text> : null}
      </View>
      <View className='flex-row items-center gap-1'>
        <Text className='text-sm font-medium text-white'>Upgrade</Text>
        <ChevronRight color='#ffffff' size={16} />
      </View>
    </LinearGradient>
  );
}
