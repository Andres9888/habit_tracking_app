/**
 * JourneyStatsSection Component
 * Displays overall journey statistics: completions, success rate, days tracking
 */

import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  BarChart3,
  CheckCircle2,
  Percent,
  Calendar,
} from 'lucide-react-native';
import type { JourneyStatsSectionProps } from '../InsightsSection.types';
import { useThemeColors } from '@/theme/ThemeContext';
import { iconSizes } from '@/theme/iconSizes';

export function JourneyStatsSection({
  totalCompletions,
  successRate,
  daysTracking,
}: JourneyStatsSectionProps) {
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
            <BarChart3 color={colors.status.premium} size={iconSizes.small} />
          </View>
          <Text className='text-lg font-bold' style={{ color: colors.text.primary }}>Your Journey</Text>
        </View>
        <Text className='mb-3 text-center text-[10px] font-bold uppercase tracking-widest' style={{ color: colors.status.premium }}>
          Overall Progress
        </Text>

        <View className='flex-row gap-3'>
          <View className='flex-1 items-center rounded-xl border bg-white/60 p-3' style={{ borderColor: colors.status.successLight }}>
            <View className='mb-2 h-8 w-8 items-center justify-center rounded-full' style={{ backgroundColor: colors.status.successLight }}>
              <CheckCircle2 color={colors.status.success} size={iconSizes.small} />
            </View>
            <Text className='text-2xl font-bold' style={{ color: colors.status.successText }}>
              {totalCompletions}
            </Text>
            <Text className='text-[10px]' style={{ color: colors.text.secondary }}>completed</Text>
          </View>
          <View className='flex-1 items-center rounded-xl border bg-white/60 p-3' style={{ borderColor: colors.status.infoLight }}>
            <View className='mb-2 h-8 w-8 items-center justify-center rounded-full' style={{ backgroundColor: colors.status.infoLight }}>
              <Percent color={colors.status.info} size={iconSizes.small} />
            </View>
            <Text className='text-2xl font-bold' style={{ color: colors.status.infoText }}>
              {Math.round(successRate)}%
            </Text>
            <Text className='text-[10px]' style={{ color: colors.text.secondary }}>success rate</Text>
          </View>
          <View className='flex-1 items-center rounded-xl border bg-white/60 p-3' style={{ borderColor: colors.status.premiumLight }}>
            <View className='mb-2 h-8 w-8 items-center justify-center rounded-full' style={{ backgroundColor: colors.status.premiumLight }}>
              <Calendar color={colors.status.premium} size={iconSizes.small} />
            </View>
            <Text className='text-2xl font-bold' style={{ color: colors.status.premiumText }}>
              {daysTracking}
            </Text>
            <Text className='text-[10px]' style={{ color: colors.text.secondary }}>days tracking</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
