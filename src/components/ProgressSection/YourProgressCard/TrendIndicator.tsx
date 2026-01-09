import React from 'react';
import { View, Text } from 'react-native';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';

interface TrendIndicatorProps {
  weeklyChange: number;
}

export function TrendIndicator({ weeklyChange }: TrendIndicatorProps) {
  if (weeklyChange > 0) {
    return (
      <View className='flex-row items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5'>
        <TrendingUp className='text-emerald-600' size={12} />
        <Text className='text-xs font-semibold text-emerald-600'>
          +{weeklyChange}%
        </Text>
      </View>
    );
  }

  if (weeklyChange < 0) {
    return (
      <View className='flex-row items-center gap-1 rounded-full bg-red-100 px-2 py-0.5'>
        <TrendingDown className='text-red-600' size={12} />
        <Text className='text-xs font-semibold text-red-600'>
          {weeklyChange}%
        </Text>
      </View>
    );
  }

  return (
    <View className='flex-row items-center gap-1 rounded-full bg-stone-100 px-2 py-0.5'>
      <Minus className='text-stone-500' size={12} />
      <Text className='text-xs font-semibold text-stone-500'>Stable</Text>
    </View>
  );
}
