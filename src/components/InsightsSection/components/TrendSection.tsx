/**
 * TrendSection Component
 * Displays monthly trend comparison with change indicator
 */

import React from 'react';
import { View, Text } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, TrendingDown } from 'lucide-react-native';

import type { TrendSectionProps } from '../InsightsSection.types';
import { TrendChangeBadge } from './TrendChangeBadge';

export function TrendSection({ trend }: TrendSectionProps) {
  const TrendIcon = trend.change >= 0 ? TrendingUp : TrendingDown;

  return (
    <View className='overflow-hidden rounded-2xl shadow-sm shadow-stone-200/50'>
      <LinearGradient
        className='absolute inset-0'
        colors={['rgba(245, 243, 255, 0.3)', '#ffffff', 'rgba(239, 246, 255, 0.3)']}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
      />
      <View className='p-5'>
        <View className='mb-4 flex-row items-center justify-center gap-2'>
          <View className='h-8 w-8 items-center justify-center rounded-lg bg-violet-100'>
            <TrendIcon className='text-violet-500' size={16} />
          </View>
          <Text className='text-lg font-bold text-stone-800'>
            Monthly Trend
          </Text>
        </View>
        <Text className='mb-3 text-center text-[10px] font-bold uppercase tracking-widest text-violet-500'>
          Month Comparison
        </Text>

        <View className='flex-row gap-3'>
          <View className='flex-1 rounded-xl border border-stone-100 bg-white/60 p-4'>
            <Text className='mb-1 text-xs text-stone-500'>This Month</Text>
            <Text className='text-3xl font-bold text-stone-800'>
              {trend.thisMonth}%
            </Text>
          </View>
          <View className='flex-1 rounded-xl border border-stone-100 bg-white/60 p-4'>
            <Text className='mb-1 text-xs text-stone-500'>Last Month</Text>
            <Text className='text-3xl font-bold text-stone-500'>
              {trend.lastMonth}%
            </Text>
          </View>
        </View>

        <TrendChangeBadge change={trend.change} />
      </View>
    </View>
  );
}
