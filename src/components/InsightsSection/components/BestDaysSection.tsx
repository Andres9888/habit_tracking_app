/**
 * BestDaysSection Component
 * Displays day-of-week performance chart with best/worst day cards
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Calendar } from 'lucide-react-native';
import type { BestDaysSectionProps } from '../InsightsSection.types';
import { DayBar } from './DayBar';
import { DayStatsCards } from './DayStatsCards';

export function BestDaysSection({
  dayStats,
  bestDay,
  worstDay,
  maxRate,
}: BestDaysSectionProps) {
  return (
    <View className='overflow-hidden rounded-2xl shadow-sm shadow-stone-200/50'>
      <View className='absolute inset-0 bg-gradient-to-br from-violet-50/30 via-white to-blue-50/30' />
      <View className='p-5'>
        <View className='mb-4 flex-row items-center justify-center gap-2'>
          <View className='h-8 w-8 items-center justify-center rounded-lg bg-violet-100'>
            <Calendar className='text-violet-500' size={16} />
          </View>
          <Text className='text-lg font-bold text-stone-800'>Best Days</Text>
        </View>
        <Text className='mb-3 text-center text-[10px] font-bold uppercase tracking-widest text-violet-500'>
          Performance by Day
        </Text>

        <View className='mb-4 flex-row items-end justify-between px-1'>
          {dayStats.map((day, index) => (
            <DayBar
              key={day.dayIndex}
              dayStats={day}
              index={index}
              isBest={bestDay?.dayIndex === day.dayIndex}
              isWorst={
                worstDay?.dayIndex === day.dayIndex &&
                day.rate < (bestDay?.rate ?? 100)
              }
              maxRate={maxRate}
            />
          ))}
        </View>

        <DayStatsCards bestDay={bestDay} worstDay={worstDay} />
      </View>
    </View>
  );
}
