/**
 * BestDaysSection Component
 * Displays day-of-week performance chart with best/worst day cards
 */

import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar } from 'lucide-react-native';
import type { BestDaysSectionProps } from '../InsightsSection.types';
import { DayBar } from './DayBar';
import { DayStatsCards } from './DayStatsCards';
import { useThemeColors } from '@/theme/ThemeContext';

export function BestDaysSection({
  dayStats,
  bestDay,
  worstDay,
  maxRate,
}: BestDaysSectionProps) {
  const { colors } = useThemeColors();

  return (
    <View className='overflow-hidden rounded-2xl shadow-sm' style={{ shadowColor: colors.border }}>
      <LinearGradient
        className='absolute inset-0'
        colors={['rgba(245, 243, 255, 0.3)', '#ffffff', 'rgba(239, 246, 255, 0.3)']}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
      />
      <View className='p-5'>
        <View className='mb-4 flex-row items-center justify-center gap-2'>
          <View className='h-8 w-8 items-center justify-center rounded-lg' style={{ backgroundColor: colors.status.premiumLight }}>
            <Calendar color={colors.status.premium} size={16} />
          </View>
          <Text className='text-lg font-bold' style={{ color: colors.text.primary }}>Best Days</Text>
        </View>
        <Text className='mb-3 text-center text-[10px] font-bold uppercase tracking-widest' style={{ color: colors.status.premium }}>
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
