import { triggerHaptic } from '@/utils/haptics';
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Trophy, AlertTriangle, ChevronRight } from 'lucide-react-native';

import type { DayStats } from './types';

interface BestWorstDayCardsProps {
  bestDay: DayStats;
  worstDay: DayStats;
  onWorstDayPress?: () => void;
}

export function BestWorstDayCards({
  bestDay,
  worstDay,
  onWorstDayPress,
}: BestWorstDayCardsProps) {
  const handleWorstDayPress = () => {
    triggerHaptic('tap');
    onWorstDayPress?.();
  };

  return (
    <View className='flex-row gap-2'>
      <View
        accessibilityLabel={`Best day: ${bestDay.day} with ${bestDay.rate}% success rate`}
        className='flex-1 rounded-xl border border-emerald-100 bg-emerald-50 p-3'
      >
        <View className='mb-1 flex-row items-center gap-1.5'>
          <Trophy className='text-emerald-500' size={14} />
          <Text className='text-xs font-medium text-emerald-600'>Best Day</Text>
        </View>
        <Text className='text-lg font-bold text-emerald-700'>
          {bestDay.day}
        </Text>
        <Text className='text-xs text-emerald-600'>
          {bestDay.rate}% success
        </Text>
      </View>

      <Pressable
        accessibilityHint='Opens tips to improve this day'
        accessibilityLabel={`Focus on ${worstDay.day} with ${worstDay.rate}% success rate. Tap for tips.`}
        accessibilityRole='button'
        className='flex-1 rounded-xl border border-amber-100 bg-amber-50 p-3 active:bg-amber-100'
        onPress={handleWorstDayPress}
      >
        <View className='mb-1 flex-row items-center justify-between'>
          <View className='flex-row items-center gap-1.5'>
            <AlertTriangle className='text-amber-500' size={14} />
            <Text className='text-xs font-medium text-amber-600'>Focus On</Text>
          </View>
          <ChevronRight className='text-amber-400' size={14} />
        </View>
        <Text className='text-lg font-bold text-amber-700'>{worstDay.day}</Text>
        <Text className='text-xs text-amber-600'>
          {worstDay.rate}% • tap for tips
        </Text>
      </Pressable>
    </View>
  );
}
