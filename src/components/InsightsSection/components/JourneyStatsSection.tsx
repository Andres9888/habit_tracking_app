/**
 * JourneyStatsSection Component
 * Displays overall journey statistics: completions, success rate, days tracking
 */

import React from 'react';
import { View, Text } from 'react-native';
import {
  BarChart3,
  CheckCircle2,
  Percent,
  Calendar,
} from 'lucide-react-native';
import type { JourneyStatsSectionProps } from '../InsightsSection.types';

export function JourneyStatsSection({
  totalCompletions,
  successRate,
  daysTracking,
}: JourneyStatsSectionProps) {
  return (
    <View className='overflow-hidden rounded-2xl shadow-sm shadow-stone-200/50'>
      <View className='absolute inset-0 bg-gradient-to-br from-violet-50/30 via-white to-blue-50/30' />
      <View className='p-5'>
        <View className='mb-4 flex-row items-center justify-center gap-2'>
          <View className='h-8 w-8 items-center justify-center rounded-lg bg-violet-100'>
            <BarChart3 className='text-violet-500' size={16} />
          </View>
          <Text className='text-lg font-bold text-stone-800'>Your Journey</Text>
        </View>
        <Text className='mb-3 text-center text-[10px] font-bold uppercase tracking-widest text-violet-500'>
          Overall Progress
        </Text>

        <View className='flex-row gap-3'>
          <View className='flex-1 items-center rounded-xl border border-emerald-100 bg-white/60 p-3'>
            <View className='mb-2 h-8 w-8 items-center justify-center rounded-full bg-emerald-100'>
              <CheckCircle2 className='text-emerald-600' size={16} />
            </View>
            <Text className='text-2xl font-bold text-emerald-700'>
              {totalCompletions}
            </Text>
            <Text className='text-[10px] text-stone-500'>completed</Text>
          </View>
          <View className='flex-1 items-center rounded-xl border border-blue-100 bg-white/60 p-3'>
            <View className='mb-2 h-8 w-8 items-center justify-center rounded-full bg-blue-100'>
              <Percent className='text-blue-600' size={16} />
            </View>
            <Text className='text-2xl font-bold text-blue-700'>
              {Math.round(successRate)}%
            </Text>
            <Text className='text-[10px] text-stone-500'>success rate</Text>
          </View>
          <View className='flex-1 items-center rounded-xl border border-violet-100 bg-white/60 p-3'>
            <View className='mb-2 h-8 w-8 items-center justify-center rounded-full bg-violet-100'>
              <Calendar className='text-violet-600' size={16} />
            </View>
            <Text className='text-2xl font-bold text-violet-700'>
              {daysTracking}
            </Text>
            <Text className='text-[10px] text-stone-500'>days tracking</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
