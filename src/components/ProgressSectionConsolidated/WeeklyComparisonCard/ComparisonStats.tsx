/**
 * ComparisonStats Component
 *
 * Displays this week vs last week comparison statistics.
 */

import React from 'react';
import { View, Text } from 'react-native';

import type { WeekOverWeekTrend } from '../../../utils/trendCalculations';

interface ComparisonStatsProps {
  trend: WeekOverWeekTrend;
}

export function ComparisonStats({ trend }: ComparisonStatsProps) {
  const {
    thisWeekCompleted,
    thisWeekTotal,
    thisWeekRate,
    lastWeekCompleted,
    lastWeekRate,
  } = trend;

  return (
    <View className='mb-3 flex-row items-center gap-4'>
      {/* This Week */}
      <View className='flex-1 rounded-xl bg-lime-50 p-3'>
        <Text className='mb-1 text-xs text-lime-700'>This Week</Text>
        <View className='flex-row items-baseline gap-1'>
          <Text className='text-xl font-bold text-lime-900'>
            {thisWeekCompleted}
          </Text>
          <Text className='text-xs text-lime-600'>/ {thisWeekTotal}</Text>
        </View>
        <Text className='mt-0.5 text-xs text-lime-600'>{thisWeekRate}%</Text>
      </View>

      {/* VS Indicator */}
      <View className='items-center'>
        <Text className='text-xs font-medium text-stone-400'>vs</Text>
      </View>

      {/* Last Week */}
      <View className='flex-1 rounded-xl bg-stone-50 p-3'>
        <Text className='mb-1 text-xs text-stone-500'>Last Week</Text>
        <View className='flex-row items-baseline gap-1'>
          <Text className='text-xl font-bold text-stone-700'>
            {lastWeekCompleted}
          </Text>
          <Text className='text-xs text-stone-500'>/ 7</Text>
        </View>
        <Text className='mt-0.5 text-xs text-stone-500'>{lastWeekRate}%</Text>
      </View>
    </View>
  );
}
