/**
 * DayStatsCards Component
 * Cards showing best and worst performing days
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Trophy, AlertTriangle } from 'lucide-react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import type { DayStats } from '../InsightsSection.types';

interface DayStatsCardsProps {
  bestDay: DayStats | null;
  worstDay: DayStats | null;
}

export function DayStatsCards({ bestDay, worstDay }: DayStatsCardsProps) {
  const { colors } = useThemeColors();
  const showWorst = worstDay && worstDay.rate < (bestDay?.rate || 100);

  return (
    <View className='flex-row gap-3'>
      {bestDay ? <View className='flex-1 rounded-xl border p-3' style={{ borderColor: colors.status.successLight, backgroundColor: colors.status.successLight }}>
          <View className='mb-1 flex-row items-center gap-1.5'>
            <Trophy color={colors.status.success} size={14} />
            <Text className='text-xs font-medium' style={{ color: colors.status.successText }}>
              Best Day
            </Text>
          </View>
          <Text className='text-lg font-bold' style={{ color: colors.status.successText }}>
            {bestDay.day}
          </Text>
          <Text className='text-xs' style={{ color: colors.status.successText }}>
            {bestDay.rate}% success
          </Text>
        </View> : null}
      {showWorst ? <View className='flex-1 rounded-xl border p-3' style={{ borderColor: colors.status.warningLight, backgroundColor: colors.status.warningLight }}>
          <View className='mb-1 flex-row items-center gap-1.5'>
            <AlertTriangle color={colors.status.warning} size={14} />
            <Text className='text-xs font-medium' style={{ color: colors.status.warningText }}>
              Needs Work
            </Text>
          </View>
          <Text className='text-lg font-bold' style={{ color: colors.status.warningText }}>
            {worstDay.day}
          </Text>
          <Text className='text-xs' style={{ color: colors.status.warningText }}>
            {worstDay.rate}% success
          </Text>
        </View> : null}
    </View>
  );
}
