/**
 * DayStatsCards Component
 * Cards showing best and worst performing days
 */

import React from 'react';
import { View, Text } from 'react-native';

import { Trophy, AlertTriangle } from 'lucide-react-native';

import type { DayStats } from '../InsightsSection.types';

interface DayStatsCardsProps {
  bestDay: DayStats | null;
  worstDay: DayStats | null;
}

export function DayStatsCards({ bestDay, worstDay }: DayStatsCardsProps) {
  const showWorst = worstDay && worstDay.rate < (bestDay?.rate || 100);

  return (
    <View className='flex-row gap-3'>
      {bestDay && (
        <View className='flex-1 rounded-xl border border-emerald-100 bg-emerald-50 p-3'>
          <View className='mb-1 flex-row items-center gap-1.5'>
            <Trophy className='text-emerald-500' size={14} />
            <Text className='text-xs font-medium text-emerald-600'>
              Best Day
            </Text>
          </View>
          <Text className='text-lg font-bold text-emerald-700'>
            {bestDay.day}
          </Text>
          <Text className='text-xs text-emerald-600'>
            {bestDay.rate}% success
          </Text>
        </View>
      )}
      {showWorst && (
        <View className='flex-1 rounded-xl border border-amber-100 bg-amber-50 p-3'>
          <View className='mb-1 flex-row items-center gap-1.5'>
            <AlertTriangle className='text-amber-500' size={14} />
            <Text className='text-xs font-medium text-amber-600'>
              Needs Work
            </Text>
          </View>
          <Text className='text-lg font-bold text-amber-700'>
            {worstDay.day}
          </Text>
          <Text className='text-xs text-amber-600'>
            {worstDay.rate}% success
          </Text>
        </View>
      )}
    </View>
  );
}
