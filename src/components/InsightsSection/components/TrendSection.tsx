/**
 * TrendSection Component
 * Displays monthly trend comparison with change indicator
 */

import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import type { TrendSectionProps } from '../InsightsSection.types';
import { TrendChangeBadge } from './TrendChangeBadge';
import { useThemeColors } from '@/theme/ThemeContext';

export function TrendSection({ trend }: TrendSectionProps) {
  const { colors } = useThemeColors();
  const TrendIcon = trend.change >= 0 ? TrendingUp : TrendingDown;

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
            <TrendIcon color={colors.status.premium} size={16} />
          </View>
          <Text className='text-lg font-bold' style={{ color: colors.text.primary }}>
            Monthly Trend
          </Text>
        </View>
        <Text className='mb-3 text-center text-[10px] font-bold uppercase tracking-widest' style={{ color: colors.status.premium }}>
          Month Comparison
        </Text>

        <View className='flex-row gap-3'>
          <View className='flex-1 rounded-xl border bg-white/60 p-4' style={{ borderColor: colors.gray[100] }}>
            <Text className='mb-1 text-xs' style={{ color: colors.text.secondary }}>This Month</Text>
            <Text className='text-3xl font-bold' style={{ color: colors.text.primary }}>
              {trend.thisMonth}%
            </Text>
          </View>
          <View className='flex-1 rounded-xl border bg-white/60 p-4' style={{ borderColor: colors.gray[100] }}>
            <Text className='mb-1 text-xs' style={{ color: colors.text.secondary }}>Last Month</Text>
            <Text className='text-3xl font-bold' style={{ color: colors.text.secondary }}>
              {trend.lastMonth}%
            </Text>
          </View>
        </View>

        <TrendChangeBadge change={trend.change} />
      </View>
    </View>
  );
}
