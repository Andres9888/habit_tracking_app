/**
 * EmptyInsightsState Component
 * Shown when not enough tracking data exists for insights
 */

import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BarChart3, Calendar } from 'lucide-react-native';
import type { EmptyInsightsStateProps } from '../InsightsSection.types';

export function EmptyInsightsState({ daysRemaining }: EmptyInsightsStateProps) {
  return (
    <Animated.View
      className='overflow-hidden rounded-2xl shadow-sm shadow-stone-200/50'
      entering={FadeInDown.delay(100).springify().damping(18)}
    >
      <LinearGradient
        className='absolute inset-0'
        colors={['rgba(245, 243, 255, 0.3)', '#ffffff', 'rgba(239, 246, 255, 0.3)']}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
      />
      <View className='p-5'>
        <View className='mb-3 flex-row items-center justify-center gap-2'>
          <View className='h-8 w-8 items-center justify-center rounded-lg bg-violet-100'>
            <BarChart3 className='text-violet-400' size={16} />
          </View>
          <Text className='text-lg font-bold text-stone-500'>Insights</Text>
        </View>
        <View className='items-center rounded-xl bg-white/60 py-6'>
          <Calendar className='mb-2 text-stone-300' size={28} />
          <Text className='text-center text-sm text-stone-500'>
            Keep tracking for insights
          </Text>
          <Text className='mt-1 text-center text-xs text-stone-500'>
            {daysRemaining} more days needed
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}
